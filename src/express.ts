/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './apps/routes';
import { testDatabaseConnection } from './helper/db-connection';

const app = express();

// Express configuration
app.use(cors());
app.use(helmet()); // Use Helmet to add various security headers
app.use(helmet.frameguard({ action: 'deny' })); // Prevent the app from being displayed in an iframe
app.use(helmet.xssFilter()); // Protect against XSS attacks
app.use(helmet.noSniff()); // Prevent MIME type sniffing
app.use(helmet.ieNoOpen()); // Prevent IE from executing downloads
app.use(express.json());
app.disable('x-powered-by'); // Disable X-Powered-By header
app.use(morgan('dev'));

// API Routes
router(app);

export default app;
