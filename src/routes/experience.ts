// TODO: REFACTOR TO SERVICE

import express from "express";
import { ExtendedRequest } from "../interfaces/express";
import { RouterFactory } from "../interfaces/general";
import logger from "../libs/logger";
import reqLogger from "../middleware/requestLog";
import { Experience } from "../models/experience.model";

const expRouter: RouterFactory = (context) => {
  const router = express.Router();

  router.post("/", reqLogger, async (req: ExtendedRequest, res) => {
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
      logger.info(`${req.id} Experience Post Successful`);
      return experience;
    } catch (err) {
      logger.error(err.message);
      return err;
    }
  });

  router.get("/", reqLogger, async (req, res) => {
    const arr: Experience[] = await Experience.findAll();
    res.json({
      experiences: arr,
    });
  });

  router.get("/:id", reqLogger, async (req, res) => {
    const id = req.params.id;
    const arr: Experience[] = await Experience.findAll({
      where: { user_id: id },
    });

    res.json({
      experiences: arr,
    });
  });

  // TODO: Add Update Functionality
  router.put("/:id", reqLogger, (req, res) => {
    res.json({
      userId: "number",
      companyName: "string",
      role: "string",
      startDate: "Date",
      endDate: "Date",
      description: "string",
    });
  });

  router.delete("/:id", reqLogger, async (req, res) => {
    const id = req.params.id;
    try {
      await Experience.destroy({ where: { id: id } });
      res.send("Successfully Exterminated");
    } catch (err) {
      logger.error(err.message);
      return err;
    }
  });

  return router;
};

export default expRouter;
