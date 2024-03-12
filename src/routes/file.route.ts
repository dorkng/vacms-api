import express, { Router } from 'express';
import { FileController } from '../controllers/file';
import fileService from '../services/file.service';
import authMiddleware from '../middlewares/auth.middleware';
import serverConfig from '../config/server.config';

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
      );

    this.router
      .route('/:filename')
      .get(express.static(serverConfig.FILE_STORAGE_PATH))
      .delete(authMiddleware.validateUserToken, this.delete);
  }
}

export default new FileRoutes().router;
