/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import UserService from '../services/users.service';

class UserController {
  static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await UserService.getUsers();
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
      res.status(201).json({
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }
}

export default UserController;
