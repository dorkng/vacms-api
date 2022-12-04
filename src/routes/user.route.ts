import { Router } from 'express';
import { UserController, VerificationController } from '../controllers/user';
import authMiddleware from '../middlewares/auth.middleware';
import systemMiddleware from '../middlewares/system.middleware';

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

    this.router.use(authMiddleware.validateUserToken);

    this.router.post('/', authMiddleware.validateSuperAdminAccess, this.create);
    
    this.router.get('/', systemMiddleware.formatRequestQuery, this.index);
  }
}

export default new UserRoutes().router;