import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/server.config';
import courtService from '../../services/court.service';
import helperUtil from '../../utils/helper.util';

export default class CourtController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const court = await courtService.create(data);
      return res.status(201).json({
        message: 'Court created successfully.',
        data: court,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court create controller method: ${error}`);
      next(error);
    }
  }

  protected async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { limit, offset, page } = req;
      const courts = await courtService.getAll(limit, offset);
      const paginationData = helperUtil.getPaginationData(limit, page, courts.totalCount);
      return res.status(200).json({
        message: 'Courts retrieved successfully.',
        data: { ...courts, ...paginationData },
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court index controller method: ${error}`);
      next(error);
    }
  }
  
  protected async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const court = await courtService.get(Number(id));
      return res.status(200).json({
        message: 'Court retrieved successfully.',
        data: court,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court get controller method: ${error}`);
      next(error);
    }
  }

  protected async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id }, body: data } = req;
      const court = await courtService.update(Number(id), data);
      return res.status(200).json({
        message: 'Court updated successfully.',
        data: court,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court update controller method: ${error}`);
      next(error);
    }
  }

  protected async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const court = await courtService.delete(Number(id));
      return res.status(200).json({
        message: 'Court deleted successfully.',
        data: court,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court delete controller method: ${error}`);
      next(error);
    }
  }
}
