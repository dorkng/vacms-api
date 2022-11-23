import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/server.config';
import userService from '../../services/user.service';
import notificationUtil from '../../utils/notification.util';

export default class UserController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const user = await userService.create(data);
      await notificationUtil.sendAccountCreationMail(user);
      return res.status(201).json({
        message: 'User created successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in user create controller method: ${error}`);
      next(error);
    }
  }
}