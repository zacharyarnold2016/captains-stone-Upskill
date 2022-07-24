import { Application } from "express";
import passport from "passport";
import { Context, Loader } from "../interfaces/general";

const loadPassport: Loader = (app: Application, context: Context) => {
  app.use(passport.initialize());
};

export default loadPassport;
