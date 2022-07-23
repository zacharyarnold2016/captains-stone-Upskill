import express from "express";
import multer from "multer";

import { Context, RouterFactory } from "../interfaces/general";
import "../libs/passport";
import login from "../middleware/login";
import reqLogger from "../middleware/requestLog";
import register from "../middleware/register";

console.log(register);

const upload = multer({ dest: "public/users" });

const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  // Define routes
  router.post("/register", reqLogger, upload.single("image"), register);

  router.use("/login", reqLogger, login);

  return router;
};

export default makeAuthRouter;
