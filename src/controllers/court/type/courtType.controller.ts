import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/server.config';
import courtService from '../../../services/court.service';
import helperUtil from '../../../utils/helper.util';

export default class CourtTypeController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const courtType = await courtService.createType(data);
      return res.status(201).json({
        message: 'Court type created successfully.',
        data: courtType,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court type create controller method: ${error}`);
      next(error);
    }
  }

  protected async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { limit, offset, page } = req;
      const courtTypes = await courtService.getAllTypes(limit, offset);
      const paginationData = helperUtil.getPaginationData(limit, page, courtTypes.totalCount);
      return res.status(200).json({
        message: 'Court types retrieved successfully.',
        data: { ...courtTypes, ...paginationData },
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court type index controller method: ${error}`);
      next(error);
    }
  }
  
  protected async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const courtType = await courtService.getType(Number(id));
      return res.status(200).json({
        message: 'Court type retrieved successfully.',
        data: courtType,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court type get controller method: ${error}`);
      next(error);
    }
  }

  protected async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id }, body: data } = req;
      const courtType = await courtService.updateType(Number(id), data);
      return res.status(200).json({
        message: 'Court type updated successfully.',
        data: courtType,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court type update controller method: ${error}`);
      next(error);
    }
  }

  protected async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const courtType = await courtService.deleteType(Number(id));
      return res.status(200).json({
        message: 'Court type deleted successfully.',
        data: courtType,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court type delete controller method: ${error}`);
      next(error);
    }
  }
}
