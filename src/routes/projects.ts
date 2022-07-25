import express from "express";
import multer from "multer";

import reqLogger from "../middleware/requestLog";
import { Context, RouterFactory } from "../interfaces/general";
import {
  createProject,
  getAllProjects,
  getOneProject,
  updateOneProject,
  deleteProject,
} from "../controllers/projects";
import { projectValidate, pathIdValidate } from "../middleware/validation";
import roles from "../middleware/roles";

const upload = multer({ dest: "public/projects" });

const projectRouter: RouterFactory = (context: Context) => {
  // eslint-disable-line no-unused-vars
  const router = express.Router();

  router.post(
    "/",
    upload.single("image"),
    reqLogger,
    projectValidate,
    createProject
  );

  // Admin Only
  router.get("/", reqLogger, roles, getAllProjects);

  router.get("/:id", reqLogger, pathIdValidate, getOneProject);

  router.put("/:id", reqLogger, pathIdValidate, updateOneProject);

  router.delete(":id", reqLogger, pathIdValidate, deleteProject);

  return router;
};

export default projectRouter;
