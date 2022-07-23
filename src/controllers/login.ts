import passport from "passport";
import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../interfaces/express";

const login = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err || !user) {
      return res.status(400).send(next(err));
    }
    const result: void = req.logIn(
      user,
      { session: false },
      async (error: Error) => {
        if (error) {
          return res.status(400).send(next(error));
        }
        const { id, firstName, lastName, title, summary, email, image } = user;
        const body = { id, firstName, lastName, title, summary, email, image };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        return res.status(200).json({ user: body, token });
      }
    );
    // ON SUCCESS
  })(req, res, next);
};

export default login;
