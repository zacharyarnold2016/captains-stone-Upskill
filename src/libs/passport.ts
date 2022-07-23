import passport from "passport";
import { Strategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";

import { User } from "../models/user.model";
import logger from "./logger";
import { ExtendedRequest } from "../interfaces/express";

const SALT: number = 4;

// Temp Fix
interface passportUser {
  id: number;
  email: string;
  image: string;
}

passport.use(
  "login",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        logger.info(`user: ${email} found`);
        // @ts-ignore | Weird thing to come back to and correct
        const values = user.dataValues;
        const testPass = values.password;

        // Case: User not Found
        if (!user) {
          const err = new Error(`given email: ${email}, user was not found!`);
          return done(err, false, { message: "no user was found" });
        }

        const validate = await bcrypt.compare(password, testPass);

        // Case: Validation Failed
        if (!validate) {
          const err = new Error("Password Incorrect");
          return done(err, false, { message: "Wrong Password" });
        }

        // Case: Success
        logger.info("Successful login");
        return done(null, user, { message: "Log In Successful!" });
      } catch (err) {
        logger.error(err);
        return done(err);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      secretOrKey: "Secret",
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter("token"),
    },
    async (token, done) => done(null, token.user)
  )
);

passport.serializeUser((user: passportUser, cb) => {
  process.nextTick(() =>
    cb(null, {
      id: user.id,
      username: user.email,
      picture: user.image,
    })
  );
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
});
