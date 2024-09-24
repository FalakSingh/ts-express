import { Response } from "express";

class ErrorRes extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const successRes = (
  res: Response,
  status: number,
  message: string,
  data = {}
) => {
  res.status(status).json({ status, message, data });
};

export { ErrorRes, successRes };
