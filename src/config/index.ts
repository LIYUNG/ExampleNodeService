import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

interface Config {
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  runningProd: boolean;
  app: string;
  port: number;
  enableClientAuth: boolean;
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpireTime: SignOptions['expiresIn'];
    refreshTokenExpireTime: SignOptions['expiresIn'];
    tokenIssuer: string;
  };
  rate: {
    limit: number;
    max: number;
  };
  db: {
    uri: string;
    name: string;
    clientPort: number;
  };
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    fromName: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  session: {
    secret: string;
  };
  defaultViewEngine: string;
}

export const config: Config = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  runningProd: process.env.NODE_ENV === 'production',
  app: process.env.APP_NAME || 'myapp',
  port: parseInt(process.env.PORT || '9095', 10),
  enableClientAuth: process.env.ENABLE_CLIENT_AUTH === 'true',
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    accessTokenExpireTime: (process.env.ACCESS_TOKEN_EXPIRE_TIME ||
      '1h') as SignOptions['expiresIn'],
    refreshTokenExpireTime: (process.env.REFRESH_TOKEN_EXPIRE_TIME ||
      '7d') as SignOptions['expiresIn'],
    tokenIssuer: process.env.TOKEN_ISSUER || 'your-issuer',
  },
  rate: {
    limit: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes in milliseconds
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'mydatabase',
    clientPort: parseInt(process.env.MONGO_CLIENT_PORT || '9005', 10),
  },
  mail: {
    host:
      process.env.NODE_ENV === 'production'
        ? process.env.SMTP_HOST || ''
        : process.env.MAILDEV_HOST || 'localhost',
    port: parseInt(
      process.env.NODE_ENV === 'production'
        ? process.env.SMTP_PORT || '587'
        : process.env.MAILDEV_PORT || '1025',
      10,
    ),
    user:
      process.env.NODE_ENV === 'production' ? process.env.SMTP_USER || '' : '',
    pass:
      process.env.NODE_ENV === 'production' ? process.env.SMTP_PASS || '' : '',
    from: process.env.FROM_EMAIL || 'no-reply@myapp.com',
    fromName: process.env.FROM_NAME || 'Your Service Name',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret',
  },
  defaultViewEngine: process.env.VIEW_ENGINE || 'ejs',
};
