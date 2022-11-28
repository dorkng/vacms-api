import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/server.config';
import caseService from '../../services/case.service';
import helperUtil from '../../utils/helper.util';

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
      const { limit, offset, page } = req;
      const cases = await caseService.getAll(limit, offset);
      const paginationData = helperUtil.getPaginationData(limit, page, cases.totalCount);
      return res.status(200).json({
        message: 'Cases retrieved successfully.',
        data: { ...cases, ...paginationData },
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
