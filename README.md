# Chronos
**Chronos** is an intelligent scheduling companion - two AI agents working together to plan, coordinate and manage your tasks through **Google Calendar**

## Setup
```bash
# Create an environment
$ python -m venv env
$ Windows: env\Scripts\activate
$ macOS / Linux: source env/bin/activate

# Install langchain dependencies
$ pip install -U langchain
$ pip install --upgrade "langgraph-cli[inmem]"

# Start the server
$ cd ui
$ npm install
$ npm run dev --tunnel
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

> SOON: Instruction on how to get all API Keys

