import express from "express";
import { RouterFactory } from "../interfaces/general";
import reqLogger from "../middleware/requestLog";
import {
  addFeedback,
  getAllFeedback,
  getOneFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedback";

const feedRouter: RouterFactory = (context) => {
  const router = express.Router();

  // Create and experience
  router.post("/", reqLogger, addFeedback);

  router.get("/", reqLogger, getAllFeedback);

  router.get("/:id", reqLogger, getOneFeedback);

  router.put("/:id", reqLogger, updateFeedback);

  router.delete(":id", reqLogger, deleteFeedback);

  return router;
};

export default feedRouter;
