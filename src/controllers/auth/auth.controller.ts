import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/sever.config';
import authService from '../../services/auth.service';


export default class AuthenticateController {
  protected async validate(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: { email, password } } = req;
      const user = await authService.validateUser(email, password);
      return res.status(200).json({
        message: 'Enter the otp sent to you.',
        data: user,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in auth validate controller method: ${error}`);
      next(error);
    }
  }

  protected async login(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: { userId, otp } } = req;
      const data = await authService.login(userId, otp);
      return res.status(200).json({
        message: 'Logged in successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in auth login controller method: ${error}`);
      next(error);
    }
  }
}