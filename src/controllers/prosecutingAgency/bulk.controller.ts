import { Request, Response, NextFunction } from 'express';
import serverConfig from '../../config/server.config';
import { BadRequestError } from '../../errors';
import prosecutingAgencyService from '../../services/prosecutingAgency.service';

export default class ProsecutingAgencyBulkController {
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

      await prosecutingAgencyService.bulkCreate(file.buffer);

      return res.status(201).json({
        message: 'Prosecuting agencies imported successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in prosecuting agency bulk create controller method: ${error}`,
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
      const path = './src/resources/csvSamples/prosecuting-agency-sample.csv';

      return res.download(path);
    } catch (error) {
      serverConfig.DEBUG(
        `Error in prosecuting agency bulk index controller method: ${error}`,
      );
      next(error);
    }
  }
}
