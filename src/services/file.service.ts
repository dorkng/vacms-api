import fs from 'fs';
import { Request } from 'express';
import multer from 'multer';
import serverConfig from '../config/server.config';
import { BadRequestError, NotFoundError } from '../errors';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

class FileService {
  private getFileIdentifier(originalname: string): string {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalname}`;
  }

  private storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback,
    ): void => {
      cb(null, serverConfig.FILE_STORAGE_PATH);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback,
    ): void => {
      cb(null, this.getFileIdentifier(file.originalname));
    },
  });

  public fileUpload = multer({
    storage: this.storage,
    limits: { fileSize: serverConfig.FILE_SIZE_LIMIT_IN_MB },
  });

  public create(file: Express.Multer.File): string {
    if (!file) throw new BadRequestError('No file attached.');
    const { filename } = file;
    return filename;
  }

  public get(path: string): string {
    if (!path) throw new BadRequestError('No file specified.');
    if (!fs.existsSync(path)) throw new NotFoundError('File not found.');
    return path;
  }

  public delete(path: string): void {
    if (!path) throw new BadRequestError('No file specified.');
    if (!fs.existsSync(path)) throw new NotFoundError('File not found.');
    fs.unlinkSync(path);
  }
}

export default new FileService();
