import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  console.error(err.message);
  res.status(500).send('Something broke!');
};

export default errorHandler;
