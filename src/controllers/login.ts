import passport from "passport";
import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../interfaces/express";

const login = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("login", async (err, user) => {
    if (err || !user) {
      if (!user) {
        res
          .status(404)
          .json({ error: "User with that Email/Password not found" });
        return next(err);
      }
      return res.status(400).send(next(err));
    }
    req.logIn(user, { session: false }, async (error: Error) => {
      if (error) {
        return res.status(505).send(next(error));
      }
      const { id, firstName, lastName, title, summary, email, image, role } =
        user;
      const body = {
        id,
        firstName,
        lastName,
        title,
        role,
        summary,
        email,
        image,
      };
      const token = jwt.sign({ user: body }, "TOP_SECRET");

      return res.status(200).json({ user: body, token });
    });
    return 0;
  })(req, res, next);
};

export default login;
