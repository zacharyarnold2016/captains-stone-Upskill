import express from "express";
import multer from "multer";

import reqLogger from "../middleware/requestLog";
import { RouterFactory } from "../interfaces/general";
import {
  createProject,
  getAllProjects,
  getOneProject,
  updateOneProject,
  deleteProject,
} from "../controllers/projects";

const upload = multer({ dest: "public/projects" });

const projectRouter: RouterFactory = (context) => {
  const router = express.Router();

  router.post("/", upload.single("image"), createProject);

  // Admin Only
  router.get("/", reqLogger, getAllProjects);

  router.get("/:id", reqLogger, getOneProject);

  router.put("/:id", reqLogger, updateOneProject);

  router.delete(":id", reqLogger, deleteProject);

  return router;
};

export default projectRouter;
