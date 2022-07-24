import express from "express";
import multer from "multer";

import { userValidate, errorResponse } from "../middleware/validation";
import { Context, RouterFactory } from "../interfaces/general";
import "../libs/passport";
import login from "../controllers/login";
import reqLogger from "../middleware/requestLog";
import register from "../controllers/register";
import RedisService from "../services/redis.service";

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
    register
  );

  router.post("/login", reqLogger, login);

  router.post("/test", reqLogger, async (req, res) => {
    const a = await RedisService.cache();
    res.send(a);
  });

  return router;
};

export default makeAuthRouter;
