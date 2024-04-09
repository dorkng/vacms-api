import { Request, Response, NextFunction } from 'express';
import serverConfig from '../../config/server.config';
import awaitingTrialService from '../../services/inmate/awaitingTrial.service';
import convictedService from '../../services/inmate/convicted.service';
import analyticService from '../../services/inmate/analytic.service';

export { default as AwaitingTrialInmateController } from './awaitingTrial/awaitingTrial.controller';
export { default as InmateAwaitingTrialBulkController } from './awaitingTrial/bulk.controller';
export { default as ConvictedInmateController } from './convicted/convicted.controller';
export { default as InmateConvictedBulkController } from './convicted/bulk.controller';

export default class InmateMetaController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const [
        awaitingTrialCount,
        convictedCount,
        awaitingTrialVsConvictedByState,
        maleVsFemaleByState,
      ] = await Promise.all([
        awaitingTrialService.getTotalCount(),
        convictedService.getTotalCount(),
        analyticService.awaitingTrialVsConvictedByState(),
        analyticService.maleVsFemaleByState(),
      ]);

      const custodialFacilityInmateVsCapacityByState =
        await analyticService.custodialFacilityInmateVsCapacityByState();

      return res.status(200).json({
        message: 'Dashboard statistics retrieved successfully.',
        data: {
          awaitingTrialCount,
          convictedCount,
          awaitingTrialVsConvictedByState,
          maleVsFemaleByState,
          custodialFacilityInmateVsCapacityByState,
        },
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate meta index controller method: ${error}`,
      );
      next(error);
    }
  }
}
