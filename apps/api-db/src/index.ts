import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbRouter } from './routes/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'api-db',
    timestamp: new Date().toISOString() 
  });
});

app.use('/api', dbRouter);

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 API-DB server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;

