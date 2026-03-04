export interface ErrorSourceType {
  path: string;
  message: string;
}

export interface ErrorResponseType {
  statusCode: number;
  message: string;
  errorSources: ErrorSourceType[];
  stack?: string;
}
