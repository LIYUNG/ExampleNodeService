import { Router } from 'express';
import { default as AppRoutes } from './app.routes';
import { Express } from 'express';
const router = (app: Express) => {
  const apiRouter = Router();

  apiRouter.use('/app', AppRoutes);
  app.use('/api', apiRouter);
};

export default router;
