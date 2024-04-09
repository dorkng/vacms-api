import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../../errors';
import inmateConvictedService from '../../../services/inmate/convicted.service';
import serverConfig from '../../../config/server.config';

export default class InmateConvictedBulkController {
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

      await inmateConvictedService.bulkCreate(file.buffer);

      return res.status(201).json({
        message: 'Convicted inmates imported successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate convicted bulk create controller method: ${error}`,
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
      const path =
        './src/resources/csvSamples/convicted-inmate-sample.csv';

      return res.download(path);
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate convicted bulk index controller method: ${error}`,
      );
      next(error);
    }
  }
}
