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
  try {
    const { token } = req.query;
    if (!token) {
      res.status(403).json({ error: "Must Provide JWT for this route" });
    } else {
      // @ts-ignore | I don't really get why it's angry at passing the right thing
      const { user } = jwt.decode(token, "TOP_SECRET");
      const { role } = user;
      await User.validate(role);
      next();
    }
  } catch (err) {
    logger.warn(`${req.id} made an unsuccessful attempt to access Admin Route`);
    res.status(403).json({ error: err.message });
  }
};

export default roles;
