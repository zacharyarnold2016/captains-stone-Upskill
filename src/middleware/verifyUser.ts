/* eslint-disable consistent-return */
import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../interfaces/express";
import { UserRole } from "../models/user.model";

const xpUserVer = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { token } = req.query;
  if (!token) {
    const e = new Error("Must Be Signed In");
    e.name = "NotLoggedIn";
    return next(e);
  }
  const reqId = req.body.user_id;
  // @ts-ignore | Once again angry at correct format
  const { user } = jwt.decode(token, "TOP_SECRET");
  const { id, role } = user;
  if (role === UserRole.ADMIN) {
    next();
  } else {
    const parsedReq = parseInt(reqId, 10);
    if (id !== parsedReq) {
      const e = new Error("Key Verification Error");
      e.name = "AuthKey";
      return next(e);
    }

    return next();
  }
};

const userVer = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { token } = req.query;
  if (!token) {
    const e = new Error("Must Be Signed In");
    e.name = "NotLoggedIn";
    return next(e);
  }
  const reqId = req.body.id;
  // @ts-ignore | Once again angry at correct format
  const { user } = jwt.decode(token, "TOP_SECRET");
  const { id, role } = user;
  if (role === UserRole.ADMIN) {
    next();
  }
  const parsed = parseInt(reqId, 10);
  if (id !== parsed) {
    const e = new Error("Key Verification Error");
    e.name = "AuthKey";
    return next(e);
  }
  return next();
};

const projVer = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { token } = req.query;
  if (!token) {
    const e = new Error("Must Be Signed In");
    e.name = "NotLoggedIn";
    return next(e);
  }
  const reqId = req.body.user_id;
  // @ts-ignore | Once again angry at correct format
  const { user } = jwt.decode(token, "TOP_SECRET");
  const { id, role } = user;
  if (role === UserRole.ADMIN) {
    next();
  }
  const parsed = parseInt(reqId, 10);
  if (id !== parsed) {
    const e = new Error("Key Verification Error");
    e.name = "AuthKey";
    return next(e);
  }
  return next();
};

const feedVer = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { token } = req.query;
  if (!token) {
    const e = new Error("Must Be Signed In");
    e.name = "NotLoggedIn";
    return next(e);
  }
  const reqId = req.body.from_user;
  // @ts-ignore | Once again angry at correct format
  const { user } = jwt.decode(token, "TOP_SECRET");
  if (!user) {
    const e = new Error("Must include JWT");
    e.name = "JWT ERROR";
    return next(e);
  }
  const { id, role } = user;
  if (role === UserRole.ADMIN) {
    next();
  }
  const parsed = parseInt(reqId, 10);
  if (id !== parsed) {
    const e = new Error("Key Verification Error");
    e.name = "AuthKey";
    return next(e);
  }
  return next();
};

export { xpUserVer, userVer, projVer, feedVer };
