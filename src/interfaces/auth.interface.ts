import { User } from '../db/models';

export interface DecodedToken {
  payload: User | null;
  expired: boolean | string | Error;
}