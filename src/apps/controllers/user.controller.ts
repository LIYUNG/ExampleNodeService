/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import UserService from '../services/users.service';
import { userQueryBuilder } from '../builders/UserQueryBuilder';

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
}

export default UserController;
