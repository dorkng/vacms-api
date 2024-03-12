import { Request, Response, NextFunction } from 'express';
import serverConfig from '../../config/server.config';
import fileService from '../../services/file.service';

export default class FileController {
  protected async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { file } = req;
      const path = fileService.create(file);
      return res.status(201).json({
        message: 'File uploaded successfully.',
        data: { path },
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in file create controller method: ${error}`);
      next(error);
    }
  }

  protected async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        params: { filename },
      } = req;

      const path = `${serverConfig.FILE_STORAGE_PATH}/${filename}`;

      fileService.delete(String(path));

      return res.status(200).json({
        message: 'File deleted successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in file delete controller method: ${error}`);
      next(error);
    }
  }
}
