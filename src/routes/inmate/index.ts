import { Router } from 'express';
import awaitingTrialRoutes from './awaitingTrial.route';
import convictedRoutes from './convicted.route';
import InmateMetaController from '../../controllers/inmate';

class InmateMetaRoutes extends InmateMetaController {
  router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.index);
  }
}

class InmateRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.use('/awaiting-trial', awaitingTrialRoutes);

    this.router.use('/convicted', convictedRoutes);

    this.router.use('/meta', new InmateMetaRoutes().router);
  }
}

export default new InmateRoutes().router;
