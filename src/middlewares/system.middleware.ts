import { Request, Response, NextFunction } from 'express';
import serverConfig from '../config/server.config';
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

  public formatRequestQuery(req: Request, res: Response, next: NextFunction ) {
    try {
      const { query: { page = 1, limit = 10 } } = req;
      req.offset = ((page ? Number(page) : 1) - 1) * Number(limit);
      req.limit = Number(limit) ? Number(limit) : 10;
      req.page = Number(page) ? Number(page) : 1;
      return next();
    } catch (error) {
      serverConfig.DEBUG(`Error in system middleware format request query method: ${error}`);
      next(error);
    }
  }
}

export default new SystemMiddlewares();
