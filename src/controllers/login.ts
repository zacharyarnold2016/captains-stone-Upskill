import { Response } from "express";
import { User } from "../models/user.model";
import logger from "../libs/logger";

let res: Response;
let user: User;
let jwt: any;

const handleLogin = (err: Error) => {
  if (err) {
    logger.error(err);
    return res.status(400).send({
      message: err.message,
    });
  }

  const body = { id: user.id, email: user.email };
  const token = jwt.sign({ user: body }, "Secret");
  logger.info(token);

  return res.json(user);
};

export default handleLogin;

// request -> middlewares(next) -> controller -> Service
