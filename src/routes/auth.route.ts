import { Router } from 'express';
import { AuthController, MeController } from '../controllers/auth';
import authMiddleware from '../middlewares/auth.middleware';

class MeRoutes extends MeController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.route('/').get(this.get).patch(this.update);
  }
}

class AuthenticateRoutes extends AuthController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post('/validate', this.validate);

    this.router.post('/login', this.login);

    this.router.post('/forgot-password', this.forgotPassword);
    
    this.router.use('/me', authMiddleware.validateUserToken, new MeRoutes().router);
  }
}

export default new AuthenticateRoutes().router;