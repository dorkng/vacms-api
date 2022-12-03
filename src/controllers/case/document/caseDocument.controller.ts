import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/server.config';
import caseService from '../../../services/case.service';
import fileService from '../../../services/file.service';

export default class CaseDocumentController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: { caseId, type }, file } = req;
      const path = fileService.create(file);
      const data = { caseId, type, path };
      const caseDocument = await caseService.createDocument(data);
      return res.status(201).json({
        message: 'Case document created successfully.',
        data: caseDocument,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case document create controller method: ${error}`);
      next(error);
    }
  }

  protected async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const caseDocument = await caseService.deleteDocument(Number(id));
      return res.status(200).json({
        message: 'Case document deleted successfully.',
        data: caseDocument,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case document delete controller method: ${error}`);
      next(error);
    }
  }
}
