import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/server.config';
import caseService from '../../../services/case.service';

export default class CaseNoteController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const note = await caseService.createNote(data);
      return res.status(201).json({
        message: 'Case note created successfully.',
        data: note,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case note create controller method: ${error}`);
      next(error);
    }
  }
}
