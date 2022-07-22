import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../interfaces/express";
import logger from "../libs/logger";

const reqLogger = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  logger.warn(req)
  logger.info("we're in this");
  logger.info(
    `${req.method} request from ID: ${req.id} on URL ${req.originalUrl}`
  );
  next();
};

export default reqLogger;
