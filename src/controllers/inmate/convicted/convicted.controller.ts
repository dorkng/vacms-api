import { Request, Response, NextFunction } from 'express';
import inmateConvictedService from '../../../services/inmate/convicted.service';
import serverConfig from '../../../config/server.config';
import helperUtil from '../../../utils/helper.util';

export default class ConvictedInmateController {
  protected async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { body: data } = req;

      const inmateConvicted = await inmateConvictedService.create(data);

      return res.status(201).json({
        message: 'Inmate created successfully.',
        data: inmateConvicted,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate convicted create controller method: ${error}`,
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
        custodialFacilityId,
        courtId,
        prosecutingAgencyId,
      } = req;

      const opts = {
        limit,
        offset,
        search: search as string,
        custodialFacilityId,
        courtId,
        prosecutingAgencyId,
      };

      const inmates = await inmateConvictedService.getAll(opts);

      const paginationData = helperUtil.getPaginationData(
        limit,
        page,
        inmates.totalCount,
      );
      return res.status(200).json({
        message: 'Inmates retrieved successfully.',
        data: { ...inmates, ...paginationData },
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate convicted index controller method: ${error}`,
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

      const inmateConvicted = await inmateConvictedService.get(
        id as unknown as number,
      );

      return res.status(200).json({
        message: 'Inmate retrieved successfully.',
        data: inmateConvicted,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate convicted get controller method: ${error}`,
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

      const inmateConvicted = await inmateConvictedService.update(
        id as unknown as number,
        data,
      );

      return res.status(200).json({
        message: 'Inmate updated successfully.',
        data: inmateConvicted,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate convicted update controller method: ${error}`,
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

      const inmateConvicted = await inmateConvictedService.delete(
        id as unknown as number,
      );

      return res.status(200).json({
        message: 'Inmate deleted successfully.',
        data: inmateConvicted,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate convicted delete controller method: ${error}`,
      );
      next(error);
    }
  }
}
