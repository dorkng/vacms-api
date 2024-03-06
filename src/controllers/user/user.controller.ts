import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/server.config';
import { BadRequestError } from '../../errors';
import userService from '../../services/user.service';
import helperUtil from '../../utils/helper.util';
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

  protected async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { limit, offset, page, query: { accessLevel } } = req;
      if (!accessLevel) throw new BadRequestError('No access level specified.');
      const opts = { limit, offset, accessLevel: accessLevel as string };
      const users = await userService.getAll(opts);
      const paginationData = helperUtil.getPaginationData(limit, page, users.totalCount);
      return res.status(200).json({
        message: 'Users retrieved successfully.',
        data: { ...users, ...paginationData },
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in user get controller method: ${error}`);
      next(error);
    }
  }
}