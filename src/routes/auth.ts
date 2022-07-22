import express, { Response } from "express";
import passport from "passport";
import bodyParser from "body-parser";
import multer from "multer";

import logger from "../libs/logger";
import { Context, RouterFactory } from "../interfaces/general";
import "../libs/passport";
import login from "../middleware/login";
import reqLogger from "../middleware/requestLog";
import { register, regHandle } from "../middleware/register";

const upload = multer({ dest: "public/" });

const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();
  // Define routes
  router.post("/register", reqLogger, upload.single("image"), register, regHandle);
  router.use("/login", reqLogger, login);
  return router;
};

export default makeAuthRouter;
