import { Request, Response, NextFunction } from 'express';
import custodialFacilityService from '../../services/custodialFacility.service';
import serverConfig from '../../config/server.config';

export { default as CustodialFacilityController } from './custodialFacility.controller';
export { default as CustodialFacilityBulkController } from './bulk.controller';

export default class CustodialFacilityMetaController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await custodialFacilityService.getDashboardData();

      return res.status(200).json({
        message: 'Dashboard statistics retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in custodial facility meta index controller method: ${error}`,
      );
      next(error);
    }
  }
}
