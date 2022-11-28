import { User } from '../../db/models';

declare module 'express' {
  export interface Request {
    user: User;
    limit: number;
    offset: number;
    page: number;
  }
}