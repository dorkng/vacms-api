import { Router } from 'express';
import {
  CaseAdjournmentController, CaseNoteController, CaseVerdictController,
  CaseController,
} from '../controllers/case';
import systemMiddleware from '../middlewares/system.middleware';

class CaseAdjournmentRoutes extends CaseAdjournmentController {
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

class CaseNoteRoutes extends CaseNoteController {
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

class CaseVerdictRoutes extends CaseVerdictController {
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

class CaseRoutes extends CaseController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.use('/adjournment', new CaseAdjournmentRoutes().router);

    this.router.use('/note', new CaseNoteRoutes().router);

    this.router.use('/verdict', new CaseVerdictRoutes().router);

    this.router.route('/')
      .post(this.create)
      .get(
        systemMiddleware.formatRequestQuery,
        this.index,
      );

    this.router.get('/:id', this.get);
  }
}

export default new CaseRoutes().router;
