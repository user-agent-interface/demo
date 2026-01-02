import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

export const registerComponents = (server: McpServer) => {
  server.registerTool(
    "get-weather",
    { description: "Get the weather for a given city" },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: "The weather is sunny",
          },
        ],
      };
    }
  );
};
