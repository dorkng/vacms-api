import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/server.config';
import caseService from '../../../services/case.service';

export default class CaseVerdictController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const verdict = await caseService.createVerdict(data);
      return res.status(201).json({
        message: 'Case verdict created successfully.',
        data: verdict,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case verdict create controller method: ${error}`);
      next(error);
    }
  }
}
