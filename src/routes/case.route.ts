import { Router } from 'express';
import CaseMetaController, {
  CaseAdjournmentController,
  CaseDocumentController,
  CaseNoteController,
  CaseReportController,
  CaseVerdictController,
  CaseController,
} from '../controllers/case';
import systemMiddleware from '../middlewares/system.middleware';
import fileService from '../services/file.service';

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

class CaseDocumentRoutes extends CaseDocumentController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router
      .route('/')
      .post(fileService.fileUpload.single('file'), this.create);
    this.router.delete('/:id', this.delete);
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

class CaseReportRoutes extends CaseReportController {
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

class CaseMetaRoutes extends CaseMetaController {
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

class CaseRoutes extends CaseController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.use('/adjournment', new CaseAdjournmentRoutes().router);

    this.router.use('/document', new CaseDocumentRoutes().router);

    this.router.use('/note', new CaseNoteRoutes().router);

    this.router.use('/report', new CaseReportRoutes().router);

    this.router.use('/verdict', new CaseVerdictRoutes().router);

    this.router.use('/meta', new CaseMetaRoutes().router);

    this.router.route('/suit-number').get(this.getBySuitNumber);

    this.router
      .route('/')
      .post(this.create)
      .get(systemMiddleware.formatRequestQuery, this.index);

    this.router.route('/:id').get(this.get).put(this.update);
  }
}

export default new CaseRoutes().router;
