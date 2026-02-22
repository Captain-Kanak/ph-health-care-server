import { Response } from "express";

interface ResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

const sendResponse = <T>(res: Response, resData: ResponseData<T>) => {
  const { statusCode, success, message, data } = resData;

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default sendResponse;
