import { Request, Response } from "express";

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
};

export const errorHandler = (
  err: unknown,
  res: Response
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details ?? null
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal server error"
  });
};
