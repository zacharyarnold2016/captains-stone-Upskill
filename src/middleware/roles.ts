import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";
import { User } from "../models/user.model";

const roles = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;

  // @ts-ignore | I don't really get why it's angry at passing the right thing
  const { user } = jwt.decode(token, "TOP_SECRET");
  const { role } = user;

  try {
    await User.validate(role);
    next();
  } catch (err) {
    logger.warn(`${req.id} made an unsuccessful attempt to access Admin Route`);
    res.status(403).send("Only Admin can access this route");
  }
};

export default roles;
