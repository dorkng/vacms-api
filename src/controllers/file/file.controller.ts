import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/sever.config';

export default class FileController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { file: { path } } = req;
      return res.status(201).json({
        message: 'File uploaded successfully.',
        data: path,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in file create controller method: ${error}`);
      next(error);
    }
  }
}