import multer, { FileFilterCallback } from 'multer';
import { BadRequestError } from '../errors';

class FileUploadMiddleware {
  private storage = multer.memoryStorage();

  public upload = multer({
    storage: this.storage,
    fileFilter: function (
      req: Express.Request,
      file: Express.Multer.File,
      callback: FileFilterCallback,
    ) {
      if (file.mimetype !== 'text/csv') {
        return callback(new BadRequestError('Only images are allowed'));
      }

      callback(null, true);
    },
  }).single('csvFile');
}

export default new FileUploadMiddleware();
