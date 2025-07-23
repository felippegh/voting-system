import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { featureRoutes } from './routes/features';
import { voteRoutes } from './routes/votes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.HELMET_ENABLED !== 'false') {
  app.use(helmet());
}

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin.split(',')
}));

const logLevel = process.env.LOG_LEVEL || 'combined';
app.use(morgan(logLevel));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/votes', voteRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;