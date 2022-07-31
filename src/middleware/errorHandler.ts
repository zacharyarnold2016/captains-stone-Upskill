import { ErrorRequestHandler, NextFunction, Response } from "express";
import { ExtendedRequest } from "../interfaces/express";
import logger from "../libs/logger";

// Used to catch any stray unknown errors with generic response.
const errorHandler = (
  err: ErrorRequestHandler,
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    logger.error(`${req.id} had an unexpected error: ${err}`);
    return res.status(500).send(err);
  }
  return next();
};

export default errorHandler;
