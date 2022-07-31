import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../interfaces/express";

const xpUserVer = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { token } = req.query;
  const reqId = req.params.user_id;
  // @ts-ignore | Once again angry at correct format
  const user = jwt.decode(token, "TOP_SECRET");
  const { id } = user;

  if (id !== reqId) {
    res.status(403).send("Only the specific user can access this route");
    const e = new Error("Unauthorized Access Attempt");
    return next(e);
  }
  return next();
};

const userVer = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { token } = req.query;
  const reqId = req.params.id;
  // @ts-ignore | Once again angry at correct format
  const { user } = jwt.decode(token, "TOP_SECRET");
  const { id } = user;
  const parsed = parseInt(reqId, 10);
  if (id !== parsed) {
    res.status(403).send("Only the specific user can access this route");
    const e = new Error("Unauthorized Access Attempt");
    return next(e);
  }
  return next();
};

export { xpUserVer, userVer };
