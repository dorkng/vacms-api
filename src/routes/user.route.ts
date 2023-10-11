import { Router } from 'express';
import { UserController, VerificationController } from '../controllers/user';
import authMiddleware from '../middlewares/auth.middleware';

class VerificationRoutes extends VerificationController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {

    this.router.route('/').post(this.create);
  }
}

class UserRoutes extends UserController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.use('/verification', new VerificationRoutes().router);

    this.router.post('/', this.create);
  }
}

export default new UserRoutes().router;
