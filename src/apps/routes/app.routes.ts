import { Router } from 'express';
import { AppController } from '../controllers';

const router = Router();

router.route('/').get(AppController.getHelloWorld);

export default router;
