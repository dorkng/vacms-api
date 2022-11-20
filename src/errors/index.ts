export class SystemError extends Error {
  private _code?: number;

  private _errors?: Array<any>;
  
  get code(): number | undefined {
    return this._code;
  }

  get errors(): Array<any> | undefined {
    return this._errors;
  }
  
  constructor(code: number, errors?: Array<any>, message: string = 'An error occured.') {
    super(message); // 'Error' breaks prototype chain here
    this._code = code || 500;
    this.message = message;
    this._errors = errors;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export class NotFoundError extends SystemError {
  constructor(message?: string) {
    super(404, null, message || 'Resource not found.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConflictError extends SystemError {
  constructor(message: string) {
    super(409, null, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends SystemError {
  constructor(message?: string) {
    super(401, null, message || 'You are not authorized to access this resource.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends SystemError {
  constructor(message?: string) {
    super(400, null, message || 'Bad request.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ForbiddenError extends SystemError {
  constructor(message?: string) {
    super(403, null, message || 'Access denied.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}