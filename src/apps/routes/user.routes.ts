import { Router } from 'express';
import { UserController } from '../controllers';

const router = Router();

router.route('/').get(UserController.getUsers).post(UserController.createUser);

router.route('/:userId').get(UserController.getUser);

export default router;
