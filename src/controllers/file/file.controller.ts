import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/server.config';
import { BadRequestError } from '../../errors';

export default class FileController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { file } = req;
      if (!file) throw new BadRequestError('No file uploaded.');
      return res.status(201).json({
        message: 'File uploaded successfully.',
        data: file.path,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in file create controller method: ${error}`);
      next(error);
    }
  }
}