import express from "express";
import multer from "multer";

import { RouterFactory } from "../interfaces/general";
import logger from "../libs/logger";
import register from "../middleware/register";
import reqLogger from "../middleware/requestLog";
import { User } from "../models/user.model";
import { Experience } from "../models/experience.model";
import Project from "../models/project.model";
import Feedback from "../models/feedback.model";

const upload = multer({ dest: "public/users" });

const userRouter: RouterFactory = (context) => {
  const router = express.Router();

  // Create User
  router.post("/", reqLogger, upload.single("image"), register);

  // Get paginated groups of users
  router.get("/", async (req, res) => {
    const arr: User[] = await User.findAll();
    res.json({
      users: arr,
    });
  });

  // Get individiual User Via ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const arr: User[] = await User.findAll({ where: { id } });
    res.json({
      user: arr,
    });
  });

  router.get("/:userId/cv", async (req, res) => {
    console.log(req);
    const { userId } = req.params;
    const cv = await User.findAll({
      where: { id: userId },
      include: [Experience, Project, Feedback],
    });
    res.json({ cv });
  });

  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      logger.error("No User Found");
      res.status(404).send("Resource Not Found");
    }
    try {
      const newUser = await User.update(update, { where: { id } });
      res.send(newUser);
    } catch (err) {
      logger.error(err.message);
      res.status(500).send("An Internal Error Occured");
    }
  });

  // Admin Locked Delete Method
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await User.destroy({ where: { id } });
      res.send("Successfully Deleted User");
    } catch (err) {
      logger.error(err.message);
      res.status(500).send("An internal Error has Occured");
    }
  });
  return router;
};

export default userRouter;
