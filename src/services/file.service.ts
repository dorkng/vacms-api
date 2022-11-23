import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import serverConfig from '../config/server.config';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

class FileService {
  private getFileIdentifier(originalname: string): string {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalname}`;
  }

  private storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback): void => {
      cb(null, serverConfig.FILE_STORAGE_PATH);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
      cb(null, this.getFileIdentifier(file.originalname));
    },
  });

  private fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file.mimetype.includes('csv')) {
      cb(null, false);
    }
    cb(null, true);
  };

  public fileUpload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
    limits : { fileSize: serverConfig.FILE_SIZE_LIMIT_IN_MB },
  });
}

export default new FileService();