import { Request, Response, NextFunction } from 'express';
import inmateAwaitingTrialService from '../../../services/inmate/awaitingTrial.service';
import serverConfig from '../../../config/server.config';
import helperUtil from '../../../utils/helper.util';

export default class AwaitingTrialInmateController {
  protected async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { body: data } = req;

      const inmateAwaitingTrial = await inmateAwaitingTrialService.create(data);

      return res.status(201).json({
        message: 'Inmate created successfully.',
        data: inmateAwaitingTrial,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate awaiting trial create controller method: ${error}`,
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

      const inmates = await inmateAwaitingTrialService.getAll(opts);

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
        `Error in inmate awaiting trial index controller method: ${error}`,
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

      const inmateAwaitingTrial = await inmateAwaitingTrialService.get(
        id as unknown as number,
      );

      return res.status(200).json({
        message: 'Inmate retrieved successfully.',
        data: inmateAwaitingTrial,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate awaiting trial get controller method: ${error}`,
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

      const inmateAwaitingTrial = await inmateAwaitingTrialService.update(
        id as unknown as number,
        data,
      );

      return res.status(200).json({
        message: 'Inmate updated successfully.',
        data: inmateAwaitingTrial,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate awaiting trial update controller method: ${error}`,
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

      const inmateAwaitingTrial = await inmateAwaitingTrialService.delete(
        id as unknown as number,
      );

      return res.status(200).json({
        message: 'Inmate deleted successfully.',
        data: inmateAwaitingTrial,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate awaiting trial delete controller method: ${error}`,
      );
      next(error);
    }
  }
}
