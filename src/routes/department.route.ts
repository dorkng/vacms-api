import { Router } from 'express';
import { DepartmentController } from '../controllers/department';
import authMiddleware from '../middlewares/auth.middleware';
import systemMiddleware from '../middlewares/system.middleware';

class DepartmentRoutes extends DepartmentController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.route('/')
      .post(
        authMiddleware.validateSuperAdminAccess,
        this.create,
      )
      .get(
        systemMiddleware.formatRequestQuery,
        this.index,
      );

    this.router.get('/:id', this.get);

    this.router.use(authMiddleware.validateSuperAdminAccess);

    this.router.route('/:id').put(this.update).delete(this.delete);
  }
}

export default new DepartmentRoutes().router;