import { Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { ExtendedRequest } from "../interfaces/express";

const SALT = 5;

const register = async (req: ExtendedRequest, res: Response) => {
  const { firstName, lastName, title, summary, role, email, password } =
    req.body;
  const image = req.file.path;
  try {
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

      res.status(200).send(returnedUser);
    } catch (err) {
      res.status(400).send(err.message);
    }
  } catch (err) {
    res.status(505).send(err.message);
  }
};

export default register;
