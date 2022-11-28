import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/server.config';
import caseService from '../../services/case.service';

export default class CaseController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const newCase = await caseService.create(data);
      return res.status(201).json({
        message: 'Case created successfully.',
        data: newCase,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case create controller method: ${error}`);
      next(error);
    }
  }

  protected async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { limit, offset } = req;
      const cases = await caseService.getAll(limit, offset);
      return res.status(200).json({
        message: 'Cases retrieved successfully.',
        data: cases,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case index controller method: ${error}`);
      next(error);
    }
  }
  
  protected async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const result = await caseService.get(Number(id));
      return res.status(200).json({
        message: 'Case retrieved successfully.',
        data: result,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in case get controller method: ${error}`);
      next(error);
    }
  }
}
