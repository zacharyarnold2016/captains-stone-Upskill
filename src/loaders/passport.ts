import passport from "passport";
import { Context, Loader } from "../interfaces/general";

const loadPassport: Loader = (app, context) => {
  app.use(passport.initialize());
};

export default loadPassport;
