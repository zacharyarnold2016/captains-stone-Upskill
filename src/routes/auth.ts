import express from "express";
import multer from "multer";

import {
  userValidate,
  errorResponse,
  loginValidate,
} from "../middleware/validation";
import { Context, RouterFactory } from "../interfaces/general";
import "../libs/passport";
import login from "../controllers/login";
import reqLogger from "../middleware/requestLog";
import register from "../controllers/register";
import errorHandler from "../middleware/errorHandler";

const upload = multer({ dest: "public/users" });

const makeAuthRouter: RouterFactory = (context: Context) => {
  // eslint-disable-line no-unused-vars
  const router = express.Router();

  router.post(
    "/register",
    upload.single("image"),
    reqLogger,
    userValidate,
    errorResponse,
    errorHandler,
    register
  );

  router.post(
    "/login",
    reqLogger,
    loginValidate,
    errorResponse,
    errorHandler,
    login
  );

  return router;
};

export default makeAuthRouter;
