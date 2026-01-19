import express from "express";
import dotenv from "dotenv";
import { uaiAgent } from "./agent.js";
import { convertToModelMessages } from "ai";

// Read .env.local variables in LOCAL
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Routes
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "uai-server",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/uai-server", async (req, res) => {
  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: "messages is required" });
  }

  const stream = await uaiAgent.stream({
    messages: await convertToModelMessages(messages),
  });

  return stream.pipeUIMessageStreamToResponse(res, {messageMetadata: ({ part }) => {
    // Attach timestamp when a message starts
    if (part.type === "start") {
      return { timestamp: new Date().toISOString() };
    }
    // You can also add metadata on finish if needed
    return undefined;
  }});
});

// Start server in LOCAL
app.listen(PORT, () => {
  console.log(`🚀 UAI-Server running on http://localhost:${PORT}`);
});

// Export for Vercel serverless in deployment
export default app;
