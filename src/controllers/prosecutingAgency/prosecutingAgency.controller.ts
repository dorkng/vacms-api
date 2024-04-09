import { Request, Response, NextFunction } from 'express';
import serverConfig from '../../config/server.config';
import helperUtil from '../../utils/helper.util';
import prosecutingAgencyService from '../../services/prosecutingAgency.service';

export default class ProsecutingAgencyController {
  protected async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { body: data } = req;

      const prosecutingAgency = await prosecutingAgencyService.create(data);

      return res.status(201).json({
        message: 'Prosecuting agency created successfully.',
        data: prosecutingAgency,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in prosecuting agency create controller method: ${error}`,
      );
      next(error);
    }
  }

  protected async index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const {
        query: { search },
        limit,
        offset,
        page,
      } = req;

      const opts = {
        limit,
        offset,
        search: search as string,
      };

      const prosecutingAgencies = await prosecutingAgencyService.getAll(opts);

      const paginationData = helperUtil.getPaginationData(
        limit,
        page,
        prosecutingAgencies.totalCount,
      );
      return res.status(200).json({
        message: 'Prosecuting agencies retrieved successfully.',
        data: { ...prosecutingAgencies, ...paginationData },
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in prosecuting agency index controller method: ${error}`,
      );
      next(error);
    }
  }

  protected async get(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const {
        params: { id },
      } = req;

      const prosecutingAgency = await prosecutingAgencyService.get(
        id as unknown as number,
      );

      return res.status(200).json({
        message: 'Prosecuting agency retrieved successfully.',
        data: prosecutingAgency,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in prosecuting agency get controller method: ${error}`,
      );
      next(error);
    }
  }

  protected async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const {
        params: { id },
        body: data,
      } = req;

      const prosecutingAgency = await prosecutingAgencyService.update(
        id as unknown as number,
        data,
      );

      return res.status(200).json({
        message: 'Prosecuting agency updated successfully.',
        data: prosecutingAgency,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in prosecuting agency update controller method: ${error}`,
      );
      next(error);
    }
  }

  protected async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const {
        params: { id },
      } = req;

      const prosecutingAgency = await prosecutingAgencyService.delete(
        id as unknown as number,
      );

      return res.status(200).json({
        message: 'Prosecuting agency deleted successfully.',
        data: prosecutingAgency,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in prosecuting agency delete controller method: ${error}`,
      );
      next(error);
    }
  }
}
