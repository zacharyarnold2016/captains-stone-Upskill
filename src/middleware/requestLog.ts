import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken'
import { ExtendedRequest } from "../interfaces/express";
import logger from "../libs/logger";

const reqLogger = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  logger.info(
    `${req.method} request from ID: ${req.id} on URL ${req.originalUrl}`
  );
  next();
};

export default reqLogger;
