import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerComponents } from "./components";

export const createComponentsMcpServer = () => {
  const server = new McpServer(
    {
      name: "uai-components",
      version: "1.0.0",
    },
    { capabilities: { logging: {} } }
  );

  registerComponents(server);

  return { server };
};
