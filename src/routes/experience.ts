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
import { experienceValidate, pathIdValidate } from "../middleware/validation";

const expRouter: RouterFactory = (contex: Context) => {
  // eslint-disable-line no-unused-vars
  const router = express.Router();
  // ADMIN or USER
  router.post("/", reqLogger, experienceValidate, addExperience);

  // Admin Only
  router.get("/", reqLogger, roles, getAllExperience);
  
  // ANYONE
  router.get("/:id", reqLogger, pathIdValidate, getOneExperience);

  // ID HOLDER ADMIN
  router.put("/:id", reqLogger, pathIdValidate, updateExperience);

  // ID HOLDER ADMIN
  router.delete("/:id", reqLogger, pathIdValidate, deleteExperience);

  return router;
};

export default expRouter;
