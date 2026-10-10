import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { searchRouter } from './routes/search.routes.js';
import { weightsRouter } from './routes/weights.routes.js';
import { herbRouter } from './routes/herb.routes.js';

export function createApp() {
  const app = express();

  app.use(
    pinoHttp({
      level: env.nodeEnv === 'production' ? 'info' : 'debug',
    })
  );
  app.use(helmet());
  app.use(
    cors({
      origin: env.frontendOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/search', searchRouter);
  app.use('/api/scoring/weights', weightsRouter);
  app.use('/api/herbs', herbRouter);

  app.use(errorHandler);

  return app;
}
