import express from "express";
import dotenv from "dotenv";
import { llmRouter } from "./routes/llm";
import { mcpRouter } from "./routes/mcp";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Routes
app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "uai-server",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/uai-server", llmRouter);
app.use("/api/mcp-server", mcpRouter);

// Start server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 UAI-Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
