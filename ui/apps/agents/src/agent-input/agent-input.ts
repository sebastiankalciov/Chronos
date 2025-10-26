import { createAgent, tool } from "langchain";
import { z } from "zod";

const getWeather = tool((input) => `It's always sunny in ${input.city}!`, {
  name: "get_weather",
  description: "Get the weather for a given city",
  schema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
});

const agent = createAgent({
  model: "openai:gpt-5-mini",
  tools: [getWeather],
});

// Run the agent
await agent.invoke({
  messages: [{ role: "user", content: "What's the weather in San Francisco?" }],
});