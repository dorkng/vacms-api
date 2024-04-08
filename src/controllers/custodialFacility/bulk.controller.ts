import { Request, Response, NextFunction } from 'express';
import serverConfig from '../../config/server.config';
import { BadRequestError } from '../../errors';
import custodialFacilityService from '../../services/custodialFacility.service';

export default class CustodialFacilityBulkController {
  protected async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { file } = req;

      if (!file) {
        throw new BadRequestError('Please attach a csv file.');
      }

      await custodialFacilityService.bulkCreate(file.buffer);

      return res.status(201).json({
        message: 'Custodial facilities imported successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in custodial facility bulk create controller method: ${error}`,
      );
      next(error);
    }
  }

  protected async index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const path = './src/resources/csvSamples/custodial-facility-sample.csv';

      return res.download(path);
    } catch (error) {
      serverConfig.DEBUG(
        `Error in custodial facility bulk index controller method: ${error}`,
      );
      next(error);
    }
  }
}
