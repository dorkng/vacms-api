import { Request, Response, NextFunction } from 'express';
import serverConfig from '../../../config/sever.config';
import userService from '../../../services/user.service';
import userUtil from '../../../utils/user.util';

export default class VerificationController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        body: passwordData,
        query: { uid: userId, token },
      } = req;
      const { confirmPassword } = await userUtil.validateUserPassword.validateAsync(passwordData);
      await userService.verifyUserAccount(Number(userId), String(token), confirmPassword);
      return res.status(200).json({
        message: 'Your password has been created successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in user verification create controller method: ${error}`,
      );
      next(error);
    }
  }
}
