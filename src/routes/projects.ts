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
import {
  projectValidate,
  pathIdValidate,
  errorResponse,
  queryVerify,
} from "../middleware/validation";
import roles from "../middleware/roles";
import errorHandler from "../middleware/errorHandler";
import { projVer } from "../middleware/verifyUser";

const upload = multer({ dest: "public/projects" });

const projectRouter: RouterFactory = (context: Context) => {
  // eslint-disable-line no-unused-vars
  const router = express.Router();
  // ADMIN or USER
  router.post(
    "/",
    upload.single("image"),
    reqLogger,
    projVer,
    projectValidate,
    errorResponse,
    errorHandler,
    createProject
  );

  // ADMIN
  router.get(
    "/",
    reqLogger,
    queryVerify,
    roles,
    errorResponse,
    errorHandler,
    getAllProjects
  );
  // ANYONE
  router.get(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    errorHandler,
    getOneProject
  );
  // ID HOLDER or ADMIN
  router.put(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    errorHandler,
    updateOneProject
  );
  // ID HOLDER or ADMIN
  router.delete(
    ":id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    errorHandler,
    deleteProject
  );

  return router;
};

export default projectRouter;
