import express from "express";
import multer from "multer";

import reqLogger from "../middleware/requestLog";
import { Context, RouterFactory } from "../interfaces/general";
import adminVerify from "../middleware/roles";
import {
  createProject,
  getAllProjects,
  getOneProject,
  updateOneProject,
  deleteProject,
} from "../controllers/projects";

const upload = multer({ dest: "public/projects" });

const projectRouter: RouterFactory = (context: Context) => {
  // eslint-disable-line no-unused-vars
  const router = express.Router();

  router.post("/", reqLogger, upload.single("image"), createProject);

  // Admin Only
  router.get("/", reqLogger, adminVerify, getAllProjects);

  router.get("/:id", reqLogger, getOneProject);

  router.put("/:id", reqLogger, updateOneProject);

  router.delete(":id", reqLogger, deleteProject);

  return router;
};

export default projectRouter;
