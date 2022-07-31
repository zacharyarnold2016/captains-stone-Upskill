import express from "express";

import roles from "../middleware/roles";
import { Context, RouterFactory } from "../interfaces/general";
import reqLogger from "../middleware/requestLog";
import {
  addExperience,
  getAllExperience,
  getOneExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experience";
import {
  experienceValidate,
  pathIdValidate,
  errorResponse,
  queryVerify,
} from "../middleware/validation";
import errorHandler from "../middleware/errorHandler";
import { xpUserVer } from "../middleware/verifyUser";

const expRouter: RouterFactory = (contex: Context) => {
  // eslint-disable-line no-unused-vars
  const router = express.Router();
  // ADMIN or USER
  router.post(
    "/",
    reqLogger,
    experienceValidate,
    errorResponse,
    xpUserVer,
    errorHandler,
    addExperience
  );

  // Admin Only
  router.get(
    "/",
    reqLogger,
    queryVerify,
    roles,
    errorResponse,
    errorHandler,
    getAllExperience
  );

  // ANYONE
  router.get(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    errorHandler,
    getOneExperience
  );

  // ID HOLDER ADMIN
  router.put(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    errorHandler,
    updateExperience
  );

  // ID HOLDER ADMIN
  router.delete(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    deleteExperience
  );

  return router;
};

export default expRouter;
