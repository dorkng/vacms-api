import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../../config/server.config';
import courtService from '../../../services/court.service';

export default class CourtAdressController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const courtAddress = await courtService.createAddress(data);
      return res.status(201).json({
        message: 'Court address created successfully.',
        data: courtAddress,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court address create controller method: ${error}`);
      next(error);
    }
  }

  protected async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { limit, offset } = req;
      const courtAddresses = await courtService.getAllAddresses(limit, offset);
      return res.status(200).json({
        message: 'Court addresses retrieved successfully.',
        data: courtAddresses,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court address index controller method: ${error}`);
      next(error);
    }
  }
  
  protected async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const courtAddress = await courtService.getAddress(Number(id));
      return res.status(200).json({
        message: 'Court address retrieved successfully.',
        data: courtAddress,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court address get controller method: ${error}`);
      next(error);
    }
  }

  protected async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id }, body: data } = req;
      const courtAddress = await courtService.updateAddress(Number(id), data);
      return res.status(200).json({
        message: 'Court address updated successfully.',
        data: courtAddress,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court address update controller method: ${error}`);
      next(error);
    }
  }

  protected async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const courtAddress = await courtService.deleteAddress(Number(id));
      return res.status(200).json({
        message: 'Court address deleted successfully.',
        data: courtAddress,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in court address delete controller method: ${error}`);
      next(error);
    }
  }
}
