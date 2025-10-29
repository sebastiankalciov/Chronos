import { createAgent } from "langchain";
import { Calculator } from "@langchain/community/tools/calculator";
import {
  GoogleCalendarCreateTool,
  GoogleCalendarViewTool,
} from "@langchain/community/tools/google_calendar";
import { ChatGoogle } from "@langchain/google-gauth";
import { MessagesAnnotation } from "@langchain/langgraph";
import { google } from "googleapis";

async function getGoogleAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY!.replace(
        /\\n/g,
        "\n"
      ),
    },
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });
}

class PatchedGoogleCalendarViewTool extends GoogleCalendarViewTool {
  async _call(input: any) {
    const auth = await getGoogleAuth();
    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const params: any = {
      calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID!,
      ...input,
    };

    const res = await calendar.events.list(params);
    return JSON.stringify(res.data.items, null, 2);
  }
}

class PatchedGoogleCalendarCreateTool extends GoogleCalendarCreateTool {
  name = "google_calendar_create";
  description = `Create the calendar event. Input must include:
  - summary: string
  - description?: string
  - startDateTime: ISO string (e.g. "2025-10-30T09:00:00")
  - endDateTime: ISO string (e.g. "2025-10-30T10:00:00")
  - timeZone?: string (default: "Europe/Bucharest")`;

  async _call(input: any) {
    const {
      summary,
      description,
      startDateTime: startStr,
      endDateTime: endStr,
      timeZone = "Europe/Bucharest",
    } = input;

    if (!summary || !startStr || !endStr) {
      return "ERROR: Missing required fields: summary, startDateTime, endDateTime";
    }

    let start, end;
    try {
      start = new Date(startStr);
      end = new Date(endStr);
    } catch {
      return "ERROR: Invalid date format. Use ISO strings like '2025-10-30T09:00:00'";
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "ERROR: Invalid date values.";
    }

    if (end <= start) {
      return "ERROR: End time must be after start time";
    }

    const event = {
      summary,
      description: description || "",
      start: {
        dateTime: start.toISOString(),
        timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone,
      },
    };

    try {
      const auth = await getGoogleAuth();
      const authClient = await auth.getClient();
      const calendar = google.calendar({ version: "v3", auth: authClient });

      const res = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID!,
        requestBody: event,
      });

      return `Event created: ${res.data.htmlLink}`;
    } catch (err: any) {
      console.error("Calendar insert error ", err);
      return `ERROR: ${err.message || "Failed to create event"}`;
    }
  }
}

export async function agentCalendar(state: typeof MessagesAnnotation.State) {
  const model = new ChatGoogle({
    model: "gemini-2.5-pro",
  });

  const googleCalendarParams = {
    credentials: {
      clientEmail: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
      privateKey: process.env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
      calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID,
    },
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    model,
  };

  const tools = [
    new Calculator(),
    new PatchedGoogleCalendarViewTool(googleCalendarParams),
    new PatchedGoogleCalendarCreateTool(googleCalendarParams),
  ];

  const calendarAgent = createAgent({
    model: model,
    tools,
  });

  const prompt = `You are Agent Calendar: A helpful assistant that is an expert in time
  management and task handling. You will get information from Agent Input
  (tasks, subtasks, how much time it requires for each task / subtask to complete) and based on that
  information you will create events in the Google Calendar considering the already made events.
  If you cannot create events because there is not enough space in the calendar,
  you will return a response to Agent Input to rethink the tasks / subtasks (how to split the tasks
  such that it will fit).
  Consider also breaks between events for meals or unexpected situations.
  The day starts at 9:00 and ends at 24:00, no tasks outside of this time.
  Start and end times must either both be date or both be dateTime.
  You are NOT supposed to do or respond to anything else that is not related to time management / event handling.
  You can also delete or move events based on the information given by Agent Input.
  You can also respond to questions about events that are already in the calendar given by
  Agent Input.
  When you finish the task, you will return a response to Agent Input.
  
  WORKFLOW:
  1. First. Always call view_calendar to see the current schedule
  2. Find free slots
  3. ONLY use create_event with EXACT format:
   summary: "Task name"
   startDateTime: "2025-10-30T09:00:00" 
   endDateTime: "2025-10-30T10:00:00"
   This is an example of a CORRECT start/end time: "start": { "dateTime": "2025-10-20T12:00:00+03:00", "timeZone": "Europe/Bucharest" }, "end": { "dateTime": "2025-10-20T15:30:00+03:00", "timeZone": "Europe/Bucharest" }
  `;

  const response = await calendarAgent.invoke({
    messages: [{ role: "system", content: prompt }, ...state.messages],
  });
  return { messages: [...state.messages, response] };
}