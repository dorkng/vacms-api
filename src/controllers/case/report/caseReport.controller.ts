import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/server.config';
import caseService from '../../../services/case.service';

export default class CaseReportController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const report = await caseService.createReport(data);
      return res.status(201).json({
        message: 'Case report created successfully.',
        data: report,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case report create controller method: ${error}`);
      next(error);
    }
  }
}
