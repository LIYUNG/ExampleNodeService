/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import UserService from '../services/users.service';
import { userQueryBuilder } from '../builders/UserQueryBuilder';
import { config } from '../../config';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../../common/errors';

const client = new OAuth2Client(config.google.clientId); // 替換為你的 Google Client ID

class AuthController {
  static signup = async (req: Request, res: Response, next: NextFunction) => {
    // await fieldsValidation(
    //   checkUserFirstname,
    //   checkUserLastname,
    //   checkEmail,
    //   checkPassword,
    // )(req);

    const { firstname, lastname, email, password } = req.body;

    const existUser = await UserService.getUserByEmail(email);
    if (existUser) {
      console.error(
        'signup: An account with this email address already exists',
      );
      throw new ErrorResponse(
        400,
        'An account with this email address already exists',
      );
    }

    await UserService.createUser({
      name,
      email,
      password,
    });

    res.status(201).json({ success: true });
  };

  static login = async (
    req: Request & { user: any },
    res: Response,
    next: NextFunction,
  ) => {
    const { email, password } = req.body;
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new ErrorResponse(400, 'User not found');
    }
    const token = jwt.sign({ userId: user._id }, config.jwt.accessTokenSecret, {
      expiresIn: config.jwt.accessTokenExpireTime,
    });

    res
      .cookie('x-auth', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .status(200)
      .json({ success: true, data: user });
  };

  static logout = (req: Request, res: Response, next: NextFunction) => {
    res
      .clearCookie('x-auth', { httpOnly: true, sameSite: 'none', secure: true })
      .status(200)
      .json({ success: true });
  };

  static verify = (
    req: Request & { user: any },
    res: Response,
    next: NextFunction,
  ) => {
    const { user } = req;
    const jwtToken = jwt.sign(
      { userId: user._id },
      config.jwt.accessTokenSecret,
      {
        expiresIn: config.jwt.accessTokenExpireTime,
      },
    );
    user.attributes = [];
    res
      .cookie('x-auth', jwtToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .status(200)
      .json({ success: true, data: user });
  };

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

export default AuthController;
