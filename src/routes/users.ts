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
} from "../middleware/validation";

const upload = multer({ dest: "public/users" });

const userRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  // Create User
  router.post(
    "/",
    reqLogger,
    userValidate,
    roles,
    upload.single("image"),
    register
  );

  // Get paginated groups of users
  router.get("/", reqLogger, roles, getAllUsers);

  // Get individiual User Via ID
  router.get("/:id", reqLogger, pathIdValidate, roles, getOneUser);

  router.get("/:userId/cv", reqLogger, pathUserIdValidate, cv);

  router.put("/:id", reqLogger, pathIdValidate, userVer, updateUser);

  // Admin Locked Delete Method
  router.delete("/:id", reqLogger, pathIdValidate, roles, deleteUser);
  return router;
};

export default userRouter;
