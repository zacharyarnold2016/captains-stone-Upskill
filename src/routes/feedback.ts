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

  // Create and experience
  router.post("/", reqLogger, feedbackValidate, addFeedback);

  router.get("/", reqLogger, getAllFeedback);

  router.get("/:id", reqLogger, pathIdValidate, getOneFeedback);

  router.put("/:id", reqLogger, pathIdValidate, updateFeedback);

  router.delete(":id", reqLogger, pathIdValidate, deleteFeedback);

  return router;
};

export default feedRouter;
