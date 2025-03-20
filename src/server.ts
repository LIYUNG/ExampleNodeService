process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err);
});

import { initServices } from './helpers';
import { WebServer } from './core/framework';
import { config } from './config';

async function startServer() {
  try {
    await initServices();
    const app = WebServer.app;
    app.listen(config.port, () => {
      console.info(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to initialize services', error as any);
  }
}

startServer();
