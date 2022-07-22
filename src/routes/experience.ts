// TODO: REFACTOR TO SERVICE

import express from "express";
import Project from "../models/project.model";
import { User } from "../models/user.model";
import { ExtendedRequest } from "../interfaces/express";
import { RouterFactory } from "../interfaces/general";
import logger from "../libs/logger";
import reqLogger from "../middleware/requestLog";
import { Experience } from "../models/experience.model";
import Feedback from "../models/feedback.model";

const expRouter: RouterFactory = (context) => {
  const router = express.Router();

  router.post("/", reqLogger, async (req: ExtendedRequest, res) => {
    // eslint-disable-next-line
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
    const { id } = req.params;
    const arr: Experience[] = await Experience.findAll({
      where: { user_id: id },
    });

    res.json({
      experiences: arr,
    });
  });

  // TODO: Add Update Functionality
  router.put("/:id", reqLogger, async (req, res) => {
    const user = await User.findAll({ include: [Feedback, Experience, Project] });
    res.send(user);
  });

  router.delete("/:id", reqLogger, async (req: ExtendedRequest, res) => {
    const { id } = req.params;
    try {
      await Experience.destroy({ where: { id } });
      return res.send("Successfully Exterminated");
    } catch (err) {
      logger.error(err.message);
      return err;
    }
  });

  return router;
};

export default expRouter;
