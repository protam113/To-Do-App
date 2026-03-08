export function logsConfig(): string {
  return 'logs-config';
}

export class AppError extends Error {
  code: string | number;
  meta?: any;

  constructor(code: string | number, message: string, meta?: any) {
    super(message);
    this.code = code;
    this.meta = meta;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}


export enum ERROR_MESSAGE {
  INCORRECT_INFORMATION = "Incorrect login information, please check your account and password",
  ENPOINT_ERROR = 'Endpoint is not configured',
}

export enum LogCode {
  INVALID_CREDENTIALS = 1002,

}