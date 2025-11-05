# Chronos

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZVMqVwwCjDo?si=oN3JY9nf41yEMnz8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

**Chronos** is an intelligent scheduling companion - two AI agents working together to plan, coordinate and manage your tasks through **Google Calendar**

## Setup
```bash
# Start the server
$ cd ui
$ npm install
$ npm run dev
```

## Template .env file
```dotenv
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://eu.api.smith.langchain.com
LANGSMITH_API_KEY=
LANGSMITH_PROJECT=
GOOGLE_API_KEY=""
GOOGLE_CALENDAR_CLIENT_EMAIL="" # [...].gserviceaccount.com
GOOGLE_CALENDAR_PRIVATE_KEY="" #-----BEGIN PRIVATE KEY-----\n[...]=\n-----END PRIVATE KEY-----\n
GOOGLE_CALENDAR_CALENDAR_ID="" # [id]@group.calendar.google.com
```

> SOON: Instructions on how to gather all API Keys

