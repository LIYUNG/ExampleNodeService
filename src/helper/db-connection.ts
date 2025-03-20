import { config } from '../config';
import { mongo } from '../config/database';

export async function testDatabaseConnection() {
  try {
    await mongo.init(config.db.uri, config.db.name);
    console.info('Mongodb initialised.');
  } catch (error) {
    console.error('Failed to initialize MongoDB:', error);
    throw error;
  }
}
