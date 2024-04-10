import { Request, Response, NextFunction } from 'express';
import serverConfig from '../../config/server.config';
import { BadRequestError } from '../../errors';
import courtService from '../../services/court.service';

export default class CourtBulkController {
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

      await courtService.bulkCreate(file.buffer);

      return res.status(201).json({
        message: 'Courts imported successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in court bulk create controller method: ${error}`,
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
      const path = './src/resources/csvSamples/court-sample.csv';

      return res.download(path);
    } catch (error) {
      serverConfig.DEBUG(
        `Error in court bulk index controller method: ${error}`,
      );
      next(error);
    }
  }
}
