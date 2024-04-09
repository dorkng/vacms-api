import { Router } from 'express';
import {
  AwaitingTrialInmateController,
  InmateAwaitingTrialBulkController,
} from '../../controllers/inmate';
import fileMiddleware from '../../middlewares/file.middleware';
import authMiddleware from '../../middlewares/auth.middleware';
import systemMiddleware from '../../middlewares/system.middleware';

class BulkRoutes extends InmateAwaitingTrialBulkController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router
      .route('/')
      .post(fileMiddleware.upload, this.create)
      .get(this.index);
  }
}

class AwaitingTrialRoutes extends AwaitingTrialInmateController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.use(
      '/bulk',
      authMiddleware.validateSuperAdminAccess,
      new BulkRoutes().router,
    );

    this.router
      .route('/')
      .post(authMiddleware.validateSuperAdminAccess, this.create)
      .get(systemMiddleware.formatRequestQuery, this.index);

    this.router.get('/:id', this.get);

    this.router.use(authMiddleware.validateSuperAdminAccess);

    this.router.route('/:id').patch(this.update).delete(this.delete);
  }
}

export default new AwaitingTrialRoutes().router;
