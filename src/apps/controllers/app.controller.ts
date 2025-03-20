/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

class AppController {
  static async getHelloWorld(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      res.status(200).json({
        message: 'Hello World',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }
}

export default AppController;
