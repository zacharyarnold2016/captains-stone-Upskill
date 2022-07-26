import express from "express";
import { Context, RouterFactory } from "../interfaces/general";
import reqLogger from "../middleware/requestLog";
import {
  addFeedback,
  getAllFeedback,
  getOneFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedback";
import { feedbackValidate, pathIdValidate } from "../middleware/validation";

const feedRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  // USER OR ADMIN
  router.post("/", reqLogger, feedbackValidate, addFeedback);
  // ADMIN
  router.get("/", reqLogger, getAllFeedback);
  // ANYONE
  router.get("/:id", reqLogger, pathIdValidate, getOneFeedback);
  // ID Holder or ADMIN
  router.put("/:id", reqLogger, pathIdValidate, updateFeedback);
  // ID Holder or ADMIN
  router.delete(":id", reqLogger, pathIdValidate, deleteFeedback);

  return router;
};

export default feedRouter;
