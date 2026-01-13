import express from "express";
import dotenv from "dotenv";
import { uaiAgent } from "./agent.js";

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
  const { prompt, messages } = req.body;
  if (!prompt && !messages) {
    return res.status(400).json({ error: "prompt or messages is required" });
  }

  const result = await uaiAgent.generate({
    messages,
    prompt,
  });

  return res.json(result);
});

// Start server in LOCAL
app.listen(PORT, () => {
  console.log(`🚀 UAI-Server running on http://localhost:${PORT}`);
});

// Export for Vercel serverless in deployment
export default app;
