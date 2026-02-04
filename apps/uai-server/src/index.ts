import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { defaultAgentProps } from './agent.js';
import {
  convertToModelMessages,
  ToolLoopAgent,
  ToolSet,
  UIMessage,
  tool,
  jsonSchema,
} from 'ai';
import { ComponentMapForServer } from '@uai/shared';

// Read .env.local variables in LOCAL
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'uai-server',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/uai-server', async (req, res) => {
  // Parse and validate the request body
  const { messages, componentMap } = req.body as {
    messages: UIMessage[];
    componentMap: ComponentMapForServer;
  };
  if (!messages) {
    return res.status(400).json({ error: 'messages is required' });
  }

  // Resolve Tools from the componentMap
  const tools: ToolSet = {};
  Object.entries(componentMap).forEach(([componentKey, component]) => {
    tools[componentKey] = tool({
      title: component.title,
      description: component.description,
      inputExamples: component.inputExamples,
      inputSchema: jsonSchema(component.inputSchema),
      outputSchema: component.outputSchema
        ? jsonSchema(component.outputSchema)
        : undefined,

      // default tool properties for uai components
      strict: true,
      supportsDeferredResults: true,
    });
  });

  const uaiAgent = new ToolLoopAgent({
    ...defaultAgentProps,
    tools,
  });

  const stream = await uaiAgent.stream({
    messages: await convertToModelMessages(messages),
  });

  return stream.pipeUIMessageStreamToResponse(res, {
    messageMetadata: ({ part }) => {
      // Attach timestamp when a message starts
      if (part.type === 'start') {
        return { timestamp: new Date().toISOString() };
      }
      // You can also add metadata on finish if needed
      return undefined;
    },
  });
});

// Start server in LOCAL
app.listen(PORT, () => {
  console.log(`🚀 UAI-Server running on http://localhost:${PORT}`);
});

// Export for Vercel serverless in deployment
export default app;
