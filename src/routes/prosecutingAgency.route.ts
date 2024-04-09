import { Router } from 'express';
import {
  ProsecutingAgencyController,
  ProsecutingAgencyBulkController,
} from '../controllers/prosecutingAgency';
import authMiddleware from '../middlewares/auth.middleware';
import systemMiddleware from '../middlewares/system.middleware';
import fileMiddleware from '../middlewares/file.middleware';

class BulkRoutes extends ProsecutingAgencyBulkController {
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

class ProsecutingAgencyRoutes extends ProsecutingAgencyController {
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

export default new ProsecutingAgencyRoutes().router;
