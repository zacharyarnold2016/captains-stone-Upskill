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
    try {
      if (err || !user) {
        return res.status(401).send(next(err));
      }
      const result: void = req.logIn(
        user,
        { session: false },
        async (err: Error) => {
          if (err) {
            return res.status(401).send(next(err));
          }

          const body = { id: user.id, email: user.email };
          const token = jwt.sign({ user: body }, "TOP_SECRET");

          return res.status(200).json({ token, user: body });
        }
      );
      // ON SUCCESS
    } catch (err) {
      throw err;
    }
  })(req, res, next);
};

export default login;
