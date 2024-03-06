import { Request, Response, NextFunction } from 'express';
import serverConfig from '../config/server.config';
import { BadRequestError, UnauthorizedError, ForbiddenError } from '../errors';
import authService from '../services/auth.service';
import userService from '../services/user.service';
import { AccessLevel } from '../interfaces/user.interface';

class AuthMiddleware {
  public async validateUserToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { headers: { authorization } } = req;
      if (!authorization) throw new BadRequestError('No token provided.');
      const [, token] = authorization.split(' ');
      if (!token) throw new BadRequestError('No token provided.');
      const { payload, expired } = authService.verifyToken(token);
      if (expired) throw new UnauthorizedError('The token provided is invalid.');
      const { id: userId } = payload;
      const user = await userService.get(userId);
      req.user = user;
      return next();
    } catch (error) {
      serverConfig.DEBUG(`Error in auth middleware validate user access method: ${error}`);
      next(error);
    }
  }

  public validateSuperAdminAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { user: { isAdmin } } = req;
      if (!isAdmin) throw new ForbiddenError();
      return next();
    } catch (error) {
      serverConfig.DEBUG(`Error in auth middleware validate super admin method: ${error}`);
      next(error);
    }
  }

  public validateAccessLevel(validAccessLevels: AccessLevel[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { user: { isAdmin, access: { accessLevel } } } = req;
        if (!isAdmin || !validAccessLevels.includes(accessLevel)) {
          throw new ForbiddenError();
        }
        return next();
      } catch (error) {
        serverConfig.DEBUG(`Error in auth middleware validate access level method: ${error}`);
        next(error);
      }
    };
  }
}

export default new AuthMiddleware();