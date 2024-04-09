import { Router } from 'express';
import { StateController } from '../controllers/state';
import systemMiddleware from '../middlewares/system.middleware';

class StateRoutes extends StateController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.route('/').get(systemMiddleware.formatRequestQuery, this.index);
  }
}

export default new StateRoutes().router;
