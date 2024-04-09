import { Router } from 'express';
import awaitingTrialRoutes from './awaitingTrial.route';
import convictedRoutes from './convicted.route';

class InmateRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.use('/awaiting-trial', awaitingTrialRoutes);

    this.router.use('/convicted', convictedRoutes);
  }
}

export default new InmateRoutes().router;
