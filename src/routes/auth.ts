import express, { Response } from "express";
import passport from "passport";
import bodyParser from "body-parser";
import multer from "multer";

import { ExtendedRequest } from "../interfaces/express";
import logger from "../libs/logger";
import { Context, RouterFactory } from "../interfaces/general";
import "../libs/passport";
import login from "../middleware/login";
import reqLogger from "../middleware/requestLog";

const upload = multer({ dest: "public/" });

const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();
  // Define routes

  router.post(
    "/register",
    upload.single("image"),
    (req, res, next) => {
      logger.info(req.body);
      logger.info(req.file);
      passport.authenticate("register", (error, user, info) => {
        logger.info(req.body);
        console.log(error, "//", user, "//", info);
      })(req, res);
      next();
    },
    (req, res) => {
      res.json({
        user: req.body,
        msg: "Successfully Registered User",
      });
    }
  );
  router.use("/login", reqLogger, login);
  return router;
};

export default makeAuthRouter;
