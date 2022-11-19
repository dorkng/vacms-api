import { Router, Request, Response } from 'express';
import { NotFoundError } from '../errors';

class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.get('/', (req: Request, res: Response) => {
      return res.status(200).json({
        message: 'Welcome to VACMS API',
        data: {
          service: 'vacms-api',
          version: '1.0.0',
        },
      });
    });

    this.router.all('*', (req: Request, res: Response) => {
      throw new NotFoundError();
    });
  }
}

export default new Routes().router;
