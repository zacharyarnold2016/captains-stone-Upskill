import express from "express";
import multer from "multer";

import { Context, RouterFactory } from "../interfaces/general";
import "../libs/passport";
import login from "../controllers/login";
import reqLogger from "../middleware/requestLog";
import register from "../controllers/register";

const upload = multer({ dest: "public/users" });


const makeAuthRouter: RouterFactory = (context: Context) => { // eslint-disable-line no-unused-vars
  const router = express.Router();

  router.post("/register", reqLogger, upload.single("image"), register);

  router.post("/login", reqLogger, login);

  return router;
};

export default makeAuthRouter;
