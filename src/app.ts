import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { swaggerSpec, swaggerUiOptions } from '@/config/swagger';
import swaggerUi from 'swagger-ui-express';
import logger from '@/utils/logger';

// Initialize Express
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    message: 'Too many requests from this IP'
  })
);

// API Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

// Health Check
app.get('/api/health', (req, res) => {
  logger.info('Health check called');
  res.status(200).json({ status: 'OK' });
});

// Error Handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
