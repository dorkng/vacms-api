export interface IUserAttribute {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  isAdmin: boolean;
}

export interface IUserVerificationAttribute {
  id: number;
  userId: number;
  otp: string;
  expiresOn: Date;
  isUsed: boolean;
}

export type AccessLevel = 'registrar' | 'lawyer' | 'director' | 'permanent-secretary' | 'attorney-general';

export interface IUserAccessAttribute {
  id: number;
  userId: number;
  accessLevel: AccessLevel;
  departmentId?: number;
}