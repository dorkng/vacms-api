import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/server.config';
import caseService from '../../../services/case.service';
import notificationUtil from '../../../utils/notification.util';

export default class CaseNoteController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { user: { id: userId }, body: data } = req;
      const { id: caseNoteId } = await caseService.createNote(userId, data);
      const caseNote = await caseService.getNote(caseNoteId);
      await notificationUtil.sendCaseNoteNotification(caseNote);
      return res.status(201).json({
        message: 'Case note created successfully.',
        data: caseNote,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case note create controller method: ${error}`);
      next(error);
    }
  }
}
