/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import UserService from '../services/users.service';
import { userQueryBuilder } from '../builders/UserQueryBuilder';
import { config } from '../../config';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(config.google.clientId); // 替換為你的 Google Client ID

class UserController {
  static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { page, limit, sort, name, email } = req.query;
      const { filter: userFilter, options } = userQueryBuilder
        .withPagination(page as string | number, limit as string | number)
        .withSort(sort as string)
        .withNameSearch(name as string)
        .withEmailSearch(email as string)
        .build();

      const users = await UserService.getUsers(userFilter, options);
      res.status(200).json({
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }

  static async getUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }
      res.status(200).json({
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;

      const user = await UserService.createUser({ name, email, password });
      if (!user) {
        res.status(400).json({
          message: 'User not created',
        });
        return;
      }
      res.status(201).json({
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }
  static thirdAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.google.clientId, // Google Client ID
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google Token' });
    }
    const { email, name, picture } = payload;
    let user;
    user = await UserService.getUserByEmail(email as string);
    if (!user) {
      const newUser = await UserService.createUser({
        email,
        name,
        password: 'thirdLogin',
        pictureUrl: picture,
      });
      user = newUser;
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      config.jwt.accessTokenSecret,
      {
        expiresIn: config.jwt.accessTokenExpireTime,
      },
    );

    res.json({
      token: jwtToken,
      email,
      name,
      pictureUrl: picture,
    });
  };
}

export default UserController;
