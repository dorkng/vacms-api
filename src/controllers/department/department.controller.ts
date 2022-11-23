import {
  Request,
  Response,
  NextFunction,
} from 'express';
import serverConfig from '../../config/server.config';
import departmentService from '../../services/department.service';

export default class DepartmentController {
  protected async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body: data } = req;
      const department = await departmentService.create(data);
      return res.status(201).json({
        message: 'Department created successfully.',
        data: department,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in department create controller method: ${error}`);
      next(error);
    }
  }

  protected async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { limit, offset } = req;
      const departments = await departmentService.getAll(limit, offset);
      return res.status(200).json({
        message: 'Departments retrieved successfully.',
        data: departments,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in department index controller method: ${error}`);
      next(error);
    }
  }

  protected async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const department = await departmentService.get(Number(id));
      return res.status(200).json({
        message: 'Department retrieved successfully.',
        data: department,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in department get controller method: ${error}`);
      next(error);
    }
  }

  protected async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id }, body: data } = req;
      const department = await departmentService.update(Number(id), data);
      return res.status(200).json({
        message: 'Department updated successfully.',
        data: department,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in department update controller method: ${error}`);
      next(error);
    }
  }

  protected async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { params: { id } } = req;
      const department = await departmentService.delete(Number(id));
      return res.status(200).json({
        message: 'Department deleted successfully.',
        data: department,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in department delete controller method: ${error}`);
      next(error);
    }
  }
}