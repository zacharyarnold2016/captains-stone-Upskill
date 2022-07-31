import express from "express";
import multer from "multer";

import roles from "../middleware/roles";
import { Context, RouterFactory } from "../interfaces/general";
import register from "../controllers/register";
import reqLogger from "../middleware/requestLog";
import {
  getAllUsers,
  getOneUser,
  updateUser,
  cv,
  deleteUser,
} from "../controllers/users";
import { userVer } from "../middleware/verifyUser";
import {
  userValidate,
  pathIdValidate,
  pathUserIdValidate,
  errorResponse,
  queryVerify,
} from "../middleware/validation";
import errorHandler from "../middleware/errorHandler";

const upload = multer({ dest: "public/users" });

const userRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  // Create User - ADMIN
  router.post(
    "/",
    upload.single("image"),
    reqLogger,
    roles,
    userValidate,
    errorResponse,
    errorHandler,
    register
  );

  // Get paginated groups of users - ADMIN
  router.get("/", reqLogger, queryVerify, roles, errorResponse, getAllUsers);

  // Get individiual User Via ID ANYONE
  router.get(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    roles,
    getOneUser
  );
  // ANYONE
  router.get(
    "/:userId/cv",
    reqLogger,
    pathUserIdValidate,
    errorResponse,
    errorHandler,
    cv
  );
  // ID Holder
  router.put(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    userVer,
    errorHandler,
    updateUser
  );

  // Admin Locked Delete Method Or ID Holder
  router.delete(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    roles,
    errorHandler,
    deleteUser
  );
  return router;
};

export default userRouter;
