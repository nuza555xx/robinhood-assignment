import { HttpException } from '@nestjs/common';
import { ErrorsCode } from './exception.code';

export interface ErrorResponse<T = any> {
  statusCode: string;
  message: string;
  payload?: T;
}

class Errors {
  static default = ErrorsCode;

  static getLocalizedError<T>(code: string): ErrorResponse<T> {
    return Errors.default[code];
  }
}

export class Exception<T = any> extends Error {
  constructor(
    private code: keyof typeof Errors.default,
    private payload?: T,
  ) {
    super();
  }

  getLocalizedException(): HttpException {
    const error = Errors.getLocalizedError<T>(this.code);

    if (this.payload) error.payload = this.payload;

    return new HttpException(error, Number(error.statusCode));
  }
}
