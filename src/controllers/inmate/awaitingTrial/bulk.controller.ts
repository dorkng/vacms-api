import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../../errors';
import inmateAwaitingTrialService from '../../../services/inmate/awaitingTrial.service';
import serverConfig from '../../../config/server.config';

export default class InmateAwaitingTrialBulkController {
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

      await inmateAwaitingTrialService.bulkCreate(file.buffer);

      return res.status(201).json({
        message: 'Awaiting trial inmates imported successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate awaiting trial bulk create controller method: ${error}`,
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
        './src/resources/csvSamples/awaiting-trial-inmate-sample.csv';

      return res.download(path);
    } catch (error) {
      serverConfig.DEBUG(
        `Error in inmate awaiting trial bulk index controller method: ${error}`,
      );
      next(error);
    }
  }
}
