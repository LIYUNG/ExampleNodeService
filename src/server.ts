process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err);
});

import app from './express';
import { config } from './config';

async function startServer() {
  try {
    app.listen(config.port, () => {
      console.info(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to initialize services', error as any);
  }
}

startServer();
