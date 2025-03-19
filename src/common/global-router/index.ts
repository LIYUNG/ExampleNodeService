import { Router } from 'express';
import { AppRoutes, AuthRoutes, UserRoutes } from '../../apps';

const router = Router();

router.use('/', AppRoutes);
router.use('/users', UserRoutes);
router.use('/auth', AuthRoutes);

export default router;
