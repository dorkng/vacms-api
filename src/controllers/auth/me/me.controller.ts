import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/sever.config';
import userService from '../../../services/user.service';

export default class MeController {
  protected async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { user } = req;
      return res.status(200).json({
        message: 'User retrieved successfully.',
        data: user,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in auth me get controller method: ${error}`);
      next(error);
    }
  }

  protected async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { user: { id: userId }, body: data } = req;
      await userService.changePassword(userId, data);
      return res.status(200).json({
        message: 'Password updated successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in auth me update controller method: ${error}`);
      next(error);
    }
  }
}