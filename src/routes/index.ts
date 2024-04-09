import express, { Router, Request, Response } from 'express';
import { NotFoundError } from '../errors';
import authMiddleware from '../middlewares/auth.middleware';
import authRoutes from './auth.route';
import caseRoutes from './case.route';
import courtRoutes from './court.route';
import custodialFacilityRoutes from './custodialFacility.route';
import departmentRoutes from './department.route';
import fileRoutes from './file.route';
import inmateRoutes from './inmate';
import prosecutingAgencyRoutes from './prosecutingAgency.route';
import stateRoutes from './state.route';
import userRoutes from './user.route';

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
          version: '2.0.0',
        },
      });
    });

    this.router.use(express.static('public'));

    this.router.use('/auth', authRoutes);

    this.router.use('/user', userRoutes);

    this.router.use(authMiddleware.validateUserToken);

    this.router.use('/case', caseRoutes);

    this.router.use('/court', courtRoutes);

    this.router.use('/custodial-facility', custodialFacilityRoutes);

    this.router.use('/department', departmentRoutes);

    this.router.use('/file', fileRoutes);

    this.router.use('/inmate', inmateRoutes);

    this.router.use('/state', stateRoutes);

    this.router.use('/prosecuting-agency', prosecutingAgencyRoutes);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.router.use('*', (req: Request, res: Response) => {
      throw new NotFoundError();
    });
  }
}

export default new Routes().router;
