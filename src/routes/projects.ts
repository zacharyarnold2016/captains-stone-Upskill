import express from "express";
import { RouterFactory } from "../interfaces/general";
import logger from "../libs/logger";

const projectRouter: RouterFactory = () => {
  const router = express.Router();

  // Create an experience
  router.post("/", (req, res) => {
    res.json({
      userId: "number",
      companyName: "string",
      role: "string",
      startDate: "Date",
      endDate: "Date",
      description: "string",
    });
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

export default projectRouter;
