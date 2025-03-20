import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { NextFunction, Request, Response } from 'express';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;
  try {
    const authHeader = req.header('X-auth');
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' });
    }
    token = authHeader.replace('Bearer ', '');
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessTokenSecret) as {
      userId: string;
      organizationId: string;
    };
    (req as any).userData = {
      userId: decoded.userId,
      organizationId: decoded.organizationId,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
