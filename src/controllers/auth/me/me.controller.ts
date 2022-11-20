import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/sever.config';

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
}