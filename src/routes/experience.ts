import express from "express";

import adminVerify from "../middleware/verify";
import { RouterFactory } from "../interfaces/general";
import reqLogger from "../middleware/requestLog";
import {
  addExperience,
  getAllExperience,
  getOneExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experience";

const expRouter: RouterFactory = (context) => { // eslint-disable-line no-unused-vars
  const router = express.Router();

  router.post("/", reqLogger, addExperience);

  // Admin Only
  router.get("/", adminVerify, reqLogger, getAllExperience);

  router.get("/:id", reqLogger, getOneExperience);

  router.put("/:id", reqLogger, updateExperience);

  router.delete("/:id", reqLogger, deleteExperience);

  return router;
};

export default expRouter;
