import { Request, Response, NextFunction } from 'express';
import serverConfig from '../config/sever.config';
import { SystemError } from '../errors';

class SystemMiddlewares {
  public async errorHandler(
    error: SystemError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    const isProduction = serverConfig.NODE_ENV === 'production';
    let errorMessage: SystemError | object = {};

    if (res.headersSent) {
      next(error);
    }

    if (!isProduction) {
      serverConfig.DEBUG(error.stack);
      errorMessage = error;
    }

    return res.status(error.code || 500).json({
      message: error.message,
      data: {
        ...(error.errors && { error: error.errors }),
        ...(!isProduction && { trace: errorMessage }),
      },
    });
  }
}

export default new SystemMiddlewares();
