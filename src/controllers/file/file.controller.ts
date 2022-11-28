import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/server.config';
import fs from 'fs';
import { BadRequestError, NotFoundError } from '../../errors';

export default class FileController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { file } = req;
      if (!file) throw new BadRequestError('No file attached.');
      return res.status(201).json({
        message: 'File uploaded successfully.',
        data: { path: file.path },
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in file create controller method: ${error}`);
      next(error);
    }
  }

  protected async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query: { path } } = req;
      if (!path) throw new BadRequestError('No file specified.');
      if (!fs.existsSync(String(path))) throw new NotFoundError('File not found.');
      return res.download(String(path));
    } catch (error) {
      serverConfig.DEBUG(`Error in file get controller method: ${error}`);
      next(error);
    }
  }

  protected async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { query: { path } } = req;
      if (!path) throw new BadRequestError('No file specified.');
      if (!fs.existsSync(String(path))) throw new NotFoundError('File not found.');
      fs.unlinkSync(String(path));
      return res.status(200).json({
        message: 'File deleted successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in file delete controller method: ${error}`);
      next(error);
    }
  }
}