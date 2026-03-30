import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import geminiRoutes from './routes/gemini.js';
import interviewsRoutes from './routes/interviews.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/gemini', geminiRoutes);
app.use('/api/interviews', interviewsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
