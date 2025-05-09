import { config } from '../config';
import { mongo } from '../dependencies/database';

export async function testDatabaseConnection() {
  try {
    await mongo.init(config.db.uri, config.db.name);
  } catch (error) {
    console.error('Failed to initialize MongoDB:', error);
    throw error;
  }
}
