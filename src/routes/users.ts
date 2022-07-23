import express from "express";
import multer from "multer";

import adminVerify from "../middleware/verify";
import { RouterFactory } from "../interfaces/general";
import register from "../controllers/register";
import reqLogger from "../middleware/requestLog";
import {
  getAllUsers,
  getOneUser,
  updateUser,
  cv,
  deleteUser,
} from "../controllers/users";

const upload = multer({ dest: "public/users" });

const userRouter: RouterFactory = (context) => {
  const router = express.Router();

  // Create User
  router.post("/", reqLogger, adminVerify, upload.single("image"), register);

  // Get paginated groups of users
  router.get("/", adminVerify, getAllUsers);

  // Get individiual User Via ID
  router.get("/:id", adminVerify, getOneUser);

  router.get("/:userId/cv", cv);

  router.put("/:id", updateUser);

  // Admin Locked Delete Method
  router.delete("/:id", adminVerify, deleteUser);
  return router;
};

export default userRouter;
