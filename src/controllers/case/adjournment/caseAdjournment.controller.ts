import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/server.config';
import caseService from '../../../services/case.service';

export default class CaseAdjournmentController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const adjournment = await caseService.createAdjournment(data);
      return res.status(201).json({
        message: 'Case adjournment created successfully.',
        data: adjournment,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case adjournment create controller method: ${error}`);
      next(error);
    }
  }
}
