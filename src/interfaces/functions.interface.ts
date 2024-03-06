import { CaseDocumentType } from './case.interface';

export interface QueryOptions {
  limit: number;
  offset: number;
  status?: string;
  type?: string;
  search?: string;
  accessLevel?: string;
}

export interface ICaseDocumentInput {
  id?: number;
  type: CaseDocumentType;
  path: string;
}
