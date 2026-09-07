import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import authRouter from './server/routes/auth';
import studentsRouter from './server/routes/students';
import academicsRouter from './server/routes/academics';
import facultyRouter from './server/routes/faculty';
import assignmentsRouter from './server/routes/assignments';
import issuesRouter from './server/routes/issues';
import lostFoundRouter from './server/routes/lostFound';
import eventsRouter from './server/routes/events';
import canteenRouter from './server/routes/canteen';
import libraryRouter from './server/routes/library';
import notificationsRouter from './server/routes/notifications';
import adminRouter from './server/routes/admin';
import mapRouter from './server/routes/map';
import aiRouter from './server/routes/ai';
import digitalIdRouter from './server/routes/digitalId';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'Smart Sathaye Campus Backend', timestamp: new Date().toISOString() });
  });

  // API Route Handlers
  app.use('/api/auth', authRouter);
  app.use('/api/students', studentsRouter);
  app.use('/api/academics', academicsRouter);
  app.use('/api/faculty', facultyRouter);
  app.use('/api/assignments', assignmentsRouter);
  app.use('/api/issues', issuesRouter);
  app.use('/api/lost-found', lostFoundRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/canteen', canteenRouter);
  app.use('/api/library', libraryRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/map', mapRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/digital-id', digitalIdRouter);

  // Vite middleware for development / Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
