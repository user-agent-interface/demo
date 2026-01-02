import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import { Router, Request, Response } from "express";
import { createComponentsMcpServer } from "../mcp/server";
import { InMemoryEventStore } from "@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore";
import { randomUUID } from "crypto";

const router = Router();

// Map sessionId to server transport for each client
const transports = new Map<string, StreamableHTTPServerTransport>();

// Utils
const getSessionId = (req: Request) => {
  return req.headers["mcp-session-id"] as string | undefined;
};

const handleInvalidSessionId = (req: Request, res: Response) => {
  res.status(400).json({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Bad Request: No valid session ID provided",
    },
    id: req?.body?.id,
  });
};

// Handle POST requests for client messages
router.post("/", async (req, res) => {
  console.log("Received MCP POST request");

  // Check for existing session ID
  const sessionId = getSessionId(req);

  if (sessionId && transports.has(sessionId)) {
    // Reuse existing transport
    const transport = transports.get(sessionId)!;

    // Handle the request with existing transport - no need to reconnect
    // The existing transport is already connected to the server
    await transport.handleRequest(req, res);
    return;
  } else if (!sessionId) {
    // POST Initialize Request
    const { server } = createComponentsMcpServer();
    const eventStore = new InMemoryEventStore(); // TODO: Use a real, persistent event store

    // Create a new transport for the session
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      eventStore, // Enable resumability
      onsessioninitialized: (sessionId: string) => {
        // Store the transport by session ID when a session is initialized
        // This avoids race conditions where requests might come in before the session is stored
        console.log(`Session initialized with ID: ${sessionId}`);
        transports.set(sessionId, transport);
      },
    });

    // Connect the transport to the MCP server BEFORE handling the request
    // so responses can flow back through the same transport
    await server.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }

  // Invalid request - unknown session ID
  handleInvalidSessionId(req, res);
});

// Handle GET requests for SSE streams
router.get("/", async (req, res) => {
  console.log("Received MCP GET request");

  const sessionId = getSessionId(req);
  if (!sessionId || !transports.has(sessionId)) {
    handleInvalidSessionId(req, res);
    return;
  }

  // Check for Last-Event-ID header for resumability
  const lastEventId = req.headers["last-event-id"] as string | undefined;
  if (lastEventId) {
    console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`);
  } else {
    console.log(`Establishing new SSE stream for session ${sessionId}`);
  }

  // Handle the request with existing transport
  const transport = transports.get(sessionId)!;
  await transport.handleRequest(req, res);
});

// Handle DELETE requests for session termination
router.delete("/", async (req, res) => {
  console.log("Received MCP DELETE request");

  const sessionId = getSessionId(req);
  if (!sessionId || !transports.has(sessionId)) {
    handleInvalidSessionId(req, res);
    return;
  }

  console.log(`Received session termination request for session ${sessionId}`);

  // Handle the request with existing transport
  const transport = transports.get(sessionId)!;
  await transport.handleRequest(req, res);

  // Delete the transport from the transports map
  transports.delete(sessionId);
});

export { router as mcpRouter };
