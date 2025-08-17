import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import { hostGuard } from './middleware.hostGuard.js';

import projectsRouter from './routes/projects.routes.js';
import tasksRouter from './routes/tasks.routes.js';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// CORS: allow from allowedHosts; in dev allow all if ALLOWED_HOSTS empty
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const host = new URL(origin).hostname;
    const allowed = config.allowedHosts;
    const ok = !allowed.length || allowed.some(h => host === h || host.endsWith('.' + h));
    if (ok) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};
app.use(cors(corsOptions));

// Host guard for direct requests
app.use(hostGuard);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: config.env });
});

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const port = config.port;
app.listen(port, () => {
  console.log(`[server] listening on port ${port} (${config.env})`);
});
