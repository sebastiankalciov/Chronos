  import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatGoogle } from "@langchain/google-gauth";
import { GoogleAIToolType } from "@langchain/google-common";

const tools: GoogleAIToolType[] = [];

async function callModel(state: typeof MessagesAnnotation.State) {
  const model =   new ChatGoogle({
    model: "gemini-2.5-pro",
  }).bindTools(tools);
  const response = await model.invoke([
    { role: "system", content: `You are a helpful assistant.` },
    ...state.messages,
  ]);
  return { messages: response };
}

function routeModelOutput(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1];
  return "__end__";
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("callModel", callModel)
  .addNode("tools", new ToolNode(tools))
  .addEdge("__start__", "callModel")
  .addConditionalEdges("callModel", routeModelOutput, ["tools", "__end__"])
  .addEdge("tools", "callModel");

export const graph = workflow.compile();