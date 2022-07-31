import { Response } from "express";
import bcrypt from "bcrypt";
import logger from "../libs/logger";
import { User } from "../models/user.model";
import { ExtendedRequest } from "../interfaces/express";

const SALT = 5;

const register = async (req: ExtendedRequest, res: Response) => {
  try {
    const { firstName, lastName, title, summary, role, email, password } =
      req.body;
    const image = req.file.path;
    const hash: string = await bcrypt.hash(password, SALT);
    try {
      const user = await User.create({
        firstName,
        lastName,
        image,
        title,
        summary,
        role,
        email,
        password: hash,
      });

      const returnedUser = {
        id: user.id,
        firstName,
        lastName,
        title,
        summary,
        email,
        image,
      };

      res.json(returnedUser);
    } catch (err) {
      logger.error(err.message);
      res.status(400).json({ error: err.message });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

export default register;
