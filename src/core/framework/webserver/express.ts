/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { AppRoutes } from '../../../apps/routes';
// import { helmetCSPConfig } from '../../constants';

const app = express();

// Express configuration
app.use(cors());
app.use(helmet()); // Use Helmet to add various security headers
// app.use(helmetCSPConfig);
app.use(helmet.frameguard({ action: 'deny' })); // Prevent the app from being displayed in an iframe
app.use(helmet.xssFilter()); // Protect against XSS attacks
app.use(helmet.noSniff()); // Prevent MIME type sniffing
app.use(helmet.ieNoOpen()); // Prevent IE from executing downloads
app.use(express.json());
app.disable('x-powered-by'); // Disable X-Powered-By header

// API Routes
app.use('/api/v1', AppRoutes);

export default app;
