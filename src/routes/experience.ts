import express from "express";
import { RouterFactory } from "../interfaces/general";
import logger from "../libs/logger";
import { Experience } from "../models/experience.model";

const expRouter: RouterFactory = (context) => {
  const router = express.Router();

  // Create and experience
  router.post("/", async (req, res) => {
    logger.info(req.body);
    const { user_id, company_name, role, startDate, endDate, description } =
      req.body;
    try {
      const experience: Experience = await Experience.create({
        user_id,
        company_name,
        role,
        startDate,
        endDate,
        description,
      });

      res.json({
        experience,
      });
      return experience;
    } catch (err) {
      logger.error(err);
      return err;
    }
  });

  router.get("/", (req, res) => {
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

  router.get("/:id", (req, res) => {
    res.json({
      id: "yikes",
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

  router.delete("/:id", (req, res) => {
    logger.info("Good Job deleting");
  });

  return router;
};

export default expRouter;
