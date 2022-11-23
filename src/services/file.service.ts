import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import serverConfig from '../config/sever.config';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

class FileService {
  private storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback): void => {
      cb(null, serverConfig.FILE_STORAGE_PATH);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
      cb(null, file.originalname);
    },
  });

  private fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file.mimetype.includes('csv')) {
      cb(null, false);
    }
    cb(null, true);
  };

  public fileUpload = multer({ storage: this.storage, fileFilter: this.fileFilter });
}

export default new FileService();