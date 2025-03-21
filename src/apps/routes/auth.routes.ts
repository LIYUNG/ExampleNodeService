import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.route('/signup').post(AuthController.signup);

// router.route('/login').post(AuthController.login);

router.route('/logout').post(AuthController.logout);

// router.route('/verify').post(AuthController.verify);

export default router;
