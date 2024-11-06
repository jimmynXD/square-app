import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err.message);

  // Don't send another response if one has already been sent
  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
};

export default errorHandler;
