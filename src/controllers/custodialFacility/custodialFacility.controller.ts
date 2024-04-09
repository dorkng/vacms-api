import { Request, Response, NextFunction } from 'express';
import serverConfig from '../../config/server.config';
import helperUtil from '../../utils/helper.util';
import custodialFacilityService from '../../services/custodialFacility.service';

export default class CustodialFacilityController {
  protected async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { body: data } = req;

      const custodialFacility = await custodialFacilityService.create(data);

      return res.status(201).json({
        message: 'Custodial facility created successfully.',
        data: custodialFacility,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in custodial facility create controller method: ${error}`,
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

      const custodialFacilities = await custodialFacilityService.getAll(opts);

      const paginationData = helperUtil.getPaginationData(
        limit,
        page,
        custodialFacilities.totalCount,
      );
      return res.status(200).json({
        message: 'Custodial facilities retrieved successfully.',
        data: { ...custodialFacilities, ...paginationData },
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in custodial facility index controller method: ${error}`,
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

      const custodialFacility = await custodialFacilityService.get(
        id as unknown as number,
      );

      return res.status(200).json({
        message: 'Custodial facility retrieved successfully.',
        data: custodialFacility,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in custodial facility get controller method: ${error}`,
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

      const custodialFacility = await custodialFacilityService.update(
        id as unknown as number,
        data,
      );

      return res.status(200).json({
        message: 'Custodial facility updated successfully.',
        data: custodialFacility,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in custodial facility update controller method: ${error}`,
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

      const custodialFacility = await custodialFacilityService.delete(
        id as unknown as number,
      );

      return res.status(200).json({
        message: 'Custodial facility deleted successfully.',
        data: custodialFacility,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in custodial facility delete controller method: ${error}`,
      );
      next(error);
    }
  }
}
