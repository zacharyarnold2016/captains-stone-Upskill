import express, { Response } from "express";
import { ExtendedRequest } from "../interfaces/express";
import Feedback from "../models/feedback.model";
import { RouterFactory } from "../interfaces/general";
import logger from "../libs/logger";

const feedRouter: RouterFactory = (context) => {
  const router = express.Router();

  // Create and experience
  router.post("/", async (req: ExtendedRequest, res: Response) => {
    const { from_user, to_user, content, company_name } = req.body;
    try{
    const feedback: Feedback = await Feedback.create({
      from_user,
      to_user,
      content,
      company_name,
    });
    return res.send(feedback);
  }catch(err){
    logger.error(err);
    return err
  }
  });

  router.get("/", (req, res) => {});

  router.get("/:id", (req, res) => {
    res.json({
      id: "number",
      userId: "number",
      companyName: "string",
      role: "string",
      startDate: "Date",
      endDate: "Date",
      description: "string",
    });
  });

  router.put("/:id", (req, res) => {
    res.json({
      userId: "number",
      companyName: "string",
      role: "string",
      startDate: "Date",
      endDate: "Date",
      description: "string",
    });
  });

  router.delete(":id", (req, res) => {
    logger.info("Good Job deleting");
  });

  return router;
};

export default feedRouter;
