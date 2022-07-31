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
import {
  errorResponse,
  feedbackValidate,
  pathIdValidate,
  queryVerify,
} from "../middleware/validation";
import roles from "../middleware/roles";
import errorHandler from "../middleware/errorHandler";
import { feedVer } from "../middleware/verifyUser";

const feedRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  // USER OR ADMIN
  router.post("/", reqLogger, feedbackValidate, feedVer, addFeedback);
  // ADMIN
  router.get(
    "/",
    reqLogger,
    queryVerify,
    roles,
    errorResponse,
    errorHandler,
    getAllFeedback
  );
  // ANYONE
  router.get(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    errorHandler,
    getOneFeedback
  );
  // ID Holder or ADMIN
  router.put(
    "/:id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    errorHandler,
    updateFeedback
  );
  // ID Holder or ADMIN
  router.delete(
    ":id",
    reqLogger,
    pathIdValidate,
    errorResponse,
    errorHandler,
    deleteFeedback
  );

  return router;
};

export default feedRouter;
