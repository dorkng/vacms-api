import { Router } from 'express';
import { FileController } from '../controllers/file';
import fileService from '../services/file.service';

class FileRoutes extends FileController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.use(fileService.fileUpload.single('file'));

    this.router.route('/')
      .post(this.create)
      .get(this.get)
      .delete(this.delete);
  }
}

export default new FileRoutes().router;