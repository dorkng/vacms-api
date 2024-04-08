import { Request, Response, NextFunction } from 'express';
import serverConfig from '../../config/server.config';
import stateService from '../../services/state.service';
import helperUtil from '../../utils/helper.util';


export default class StateController {
  protected async index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const {
        limit,
        offset,
        page,
        query: { search },
      } = req;

      const opts = {
        limit,
        offset,
        search: search as string,
      };

      const states = await stateService.getAll(opts);

      const paginationData = helperUtil.getPaginationData(
        limit,
        page,
        states.totalCount,
      );

      return res.status(200).json({
        message: 'States retrieved successfully.',
        data: { ...states, ...paginationData },
      });

    } catch (error) {
      serverConfig.DEBUG(`Error in state index controller method: ${error}`);
      next(error);
    }
  }
}
