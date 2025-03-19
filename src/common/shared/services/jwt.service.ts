import JWT, { SignOptions } from 'jsonwebtoken';
import { ApiResponse, ErrorResponse } from '../utils';
import { DB } from '../../../core/framework';
import { config } from '../../../core/config';

const redis = DB.redis;

redis.init();
const client = redis.getClient();

class JwtService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private accessTokenExpireTime: SignOptions['expiresIn'];
  private refreshTokenExpireTime: SignOptions['expiresIn'];
  private tokenIssuer: string;

  constructor() {
    this.accessTokenSecret = config.jwt.accessTokenSecret;
    this.refreshTokenSecret = config.jwt.refreshTokenSecret;
    this.accessTokenExpireTime = config.jwt.accessTokenExpireTime;
    this.refreshTokenExpireTime = config.jwt.refreshTokenExpireTime;
    this.tokenIssuer = config.jwt.tokenIssuer;
  }

  signAccessToken(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const payload = {};
      const options: SignOptions = {
        expiresIn: this.accessTokenExpireTime,
        issuer: this.tokenIssuer,
        audience: userId,
      };

      JWT.sign(
        payload,
        this.accessTokenSecret,
        options,
        (err: any, token?: string) => {
          if (err || !token) {
            console.error(err?.message, err);
            const errorResponse = new ErrorResponse(
              'INTERNAL_SERVER_ERROR',
              'Internal Server Error',
            );
            return reject(errorResponse);
          }
          resolve(token);
        },
      );
    });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      client.get(`bl_${token}`, (err: any, result: any) => {
        if (err) {
          console.error(err.message, err);
          const errorResponse = new ErrorResponse(
            'INTERNAL_SERVER_ERROR',
            'Internal Server Error',
          );
          return reject(errorResponse);
        }
        resolve(result === 'blacklisted');
      });
    });
  }

  verifyAccessToken(req: any, res: any, next: any): void {
    if (!req.headers['authorization']) {
      const errorResponse = new ErrorResponse('UNAUTHORIZED', 'Unauthorized', [
        'No authorization header',
      ]);
      return ApiResponse.error(res, {
        success: false,
        error: errorResponse,
      }) as any;
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    JWT.verify(
      token,
      this.accessTokenSecret,
      async (err: any, payload: any) => {
        if (err) {
          const message =
            err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
          const errorResponse = new ErrorResponse('UNAUTHORIZED', message);
          return ApiResponse.error(res, {
            success: false,
            error: errorResponse,
          });
        }

        try {
          const blacklisted = await this.isTokenBlacklisted(token);
          if (blacklisted) {
            const errorResponse = new ErrorResponse('FORBIDDEN', 'Forbidden', [
              'Token is blacklisted',
            ]);
            return ApiResponse.error(res, {
              success: false,
              error: errorResponse,
            });
          }
        } catch (error) {
          return ApiResponse.error(res, {
            success: false,
            error: error as ErrorResponse,
          });
        }

        req.payload = payload;
        next();
      },
    );
  }

  verifyRefreshToken(refreshToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        this.refreshTokenSecret,
        (err: any, payload: any) => {
          if (err) {
            const errorResponse = new ErrorResponse(
              'UNAUTHORIZED',
              'Unauthorized',
            );
            return reject(errorResponse);
          }

          const userId = payload?.aud as string;

          client.get(userId, (redisErr: any, result: any) => {
            if (redisErr) {
              console.error(redisErr.message, redisErr);
              const errorResponse = new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                'Internal Server Error',
              );
              return reject(errorResponse);
            }

            if (refreshToken === result) {
              return resolve(userId);
            }

            const errorResponse = new ErrorResponse(
              'UNAUTHORIZED',
              'Unauthorized',
            );
            return reject(errorResponse);
          });
        },
      );
    });
  }

  checkAccessToken(accessToken: string): Promise<{ userId: string }> {
    return new Promise((resolve, reject) => {
      JWT.verify(
        accessToken,
        this.accessTokenSecret,
        (err: any, payload: any) => {
          if (err) {
            const message =
              err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            const errorResponse = new ErrorResponse('UNAUTHORIZED', message);
            return reject(errorResponse);
          }

          const userId = payload?.aud as string;

          resolve({ userId });
        },
      );
    });
  }

  checkRefreshToken(refreshToken: string): Promise<{ userId: string }> {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        this.refreshTokenSecret,
        (err: any, payload: any) => {
          if (err) {
            const errorResponse = new ErrorResponse(
              'UNAUTHORIZED',
              'Unauthorized',
            );
            return reject(errorResponse);
          }

          const userId = payload?.aud as string;

          client.get(userId, (redisErr: any, result: any) => {
            if (redisErr) {
              console.error(redisErr.message, redisErr);
              const errorResponse = new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                'Internal Server Error',
              );
              return reject(errorResponse);
            }

            if (refreshToken === result) {
              return resolve({ userId });
            }

            const errorResponse = new ErrorResponse(
              'UNAUTHORIZED',
              'Unauthorized',
            );
            return reject(errorResponse);
          });
        },
      );
    });
  }
}

export default new JwtService();
