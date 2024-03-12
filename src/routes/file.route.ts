import { Router } from 'express';
import { FileController } from '../controllers/file';
import fileService from '../services/file.service';
import authMiddleware from '../middlewares/auth.middleware';

class FileRoutes extends FileController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router
      .route('/')
      .post(
        authMiddleware.validateUserToken,
        fileService.fileUpload.single('file'),
        this.create,
      )
      .get(this.get)
      .delete(authMiddleware.validateUserToken, this.delete);
  }
}

export default new FileRoutes().router;