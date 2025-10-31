import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import agentInput from "./agent-input.js";
import { agentCalendar } from "../agent-calendar/agent-calendar.js";

// decide what to do based on the last message
function router(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1];

  return lastMessage.content.includes("calendar") ? "agentCalendar" : "__end__";
}

// build the graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agentInput", agentInput)
  .addNode("agentCalendar", agentCalendar)
  .addEdge("__start__", "agentInput")
  .addEdge("agentInput", "agentCalendar")
  .addConditionalEdges("agentInput", router, ["agentCalendar", "__end__"])
  .addEdge("agentCalendar", "agentInput");

export const graph = workflow.compile();
