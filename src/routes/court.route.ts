import { Router } from 'express';
import {
  CourtTypeController,
  CourtAddressController,
  CourtController,
  CourtBulkController,
} from '../controllers/court';
import authMiddleware from '../middlewares/auth.middleware';
import systemMiddleware from '../middlewares/system.middleware';
import fileMiddleware from '../middlewares/file.middleware';

class CourtTypeRoutes extends CourtTypeController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router
      .route('/')
      .post(authMiddleware.validateSuperAdminAccess, this.create)
      .get(systemMiddleware.formatRequestQuery, this.index);

    this.router.get('/:id', this.get);

    this.router.use(authMiddleware.validateSuperAdminAccess);

    this.router.route('/:id').patch(this.update).delete(this.delete);
  }
}

class CourtAddressRoutes extends CourtAddressController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router
      .route('/')
      .post(authMiddleware.validateSuperAdminAccess, this.create)
      .get(systemMiddleware.formatRequestQuery, this.index);

    this.router.get('/:id', this.get);

    this.router.use(authMiddleware.validateSuperAdminAccess);

    this.router.route('/:id').patch(this.update).delete(this.delete);
  }
}

class CourtBulkRoutes extends CourtBulkController {
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

class CourtRoutes extends CourtController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.use('/address', new CourtAddressRoutes().router);

    this.router.use('/bulk', new CourtBulkRoutes().router);

    this.router.use('/type', new CourtTypeRoutes().router);

    this.router
      .route('/')
      .post(authMiddleware.validateSuperAdminAccess, this.create)
      .get(systemMiddleware.formatRequestQuery, this.index);

    this.router.get('/:id', this.get);

    this.router.use(authMiddleware.validateSuperAdminAccess);

    this.router.route('/:id').patch(this.update).delete(this.delete);
  }
}

export default new CourtRoutes().router;
