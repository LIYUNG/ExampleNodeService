import { Router, Express } from 'express';
import { default as AppRoutes } from './app.routes';
import { default as UserRoutes } from './user.routes';

const router = (app: Express) => {
  const apiRouter = Router();

  apiRouter.use('/app', AppRoutes);
  apiRouter.use('/user', UserRoutes);
  app.use('/api', apiRouter);
};

export default router;
