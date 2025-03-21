import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

interface Config {
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  google: {
    clientId: string;
  };
  runningProd: boolean;
  app: string;
  port: number;
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpireTime: SignOptions['expiresIn'];
    refreshTokenExpireTime: SignOptions['expiresIn'];
    tokenIssuer: string;
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
}

export const config: Config = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
  },
  runningProd: process.env.NODE_ENV === 'production',
  app: process.env.APP_NAME || 'myapp',
  port: parseInt(process.env.PORT || '9095', 10),
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    accessTokenExpireTime: (process.env.ACCESS_TOKEN_EXPIRE_TIME ||
      '1h') as SignOptions['expiresIn'],
    refreshTokenExpireTime: (process.env.REFRESH_TOKEN_EXPIRE_TIME ||
      '7d') as SignOptions['expiresIn'],
    tokenIssuer: process.env.TOKEN_ISSUER || 'your-issuer',
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
};
