import { NextFunction, Response } from "express";
import passport from "passport";
import { ExtendedRequest } from "../interfaces/express";
import logger from "../libs/logger";

const register = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  logger.warn(req.body)
  passport.authenticate("register", (error, user, info) => {})(req, res);
  next();
};

const regHandle = (req: ExtendedRequest, res: Response) => {
  const { body } = req;
  const fullname = `${body.firstName} ${body.lastName}`;
  const user = { role: body.role, email: body.email, name: fullname };
  res.json({
    user,
    msg: "Successfully Registered User",
  });
};

export { register, regHandle };
