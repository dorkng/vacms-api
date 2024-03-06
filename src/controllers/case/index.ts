import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/server.config';
import caseService from '../../services/case.service';

export { default as CaseAdjournmentController } from './adjournment/caseAdjournment.controller';
export { default as CaseDocumentController } from './document/caseDocument.controller';
export { default as CaseNoteController } from './note/caseNote.controller';
export { default as CaseReportController } from './report/caseReport.controller';
export { default as CaseVerdictController } from './verdict/caseVerdict.controller';
export { default as CaseController } from './case.controller';

export default class CaseMetaController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { user: { isAdmin, access } } = req;
      const accessLevel = access ? access.accessLevel : null;
      const dashboardStatistics = await caseService.getDashboardStatistics(isAdmin, accessLevel);
      return res.status(200).json({
        message: 'Dashboard statistics retrieved successfully.',
        data: dashboardStatistics,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case meta index controller method: ${error}`);
      next(error);
    }
  }
}