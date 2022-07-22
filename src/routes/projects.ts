import express from "express";
import multer from "multer";
import Project from "../models/project.model";
import { RouterFactory } from "../interfaces/general";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";

const upload = multer({ dest: "public/projects" });

const projectRouter: RouterFactory = (context) => {
  const router = express.Router();

  // Create an experience
  router.post(
    "/",
    upload.single("image"),
    async (req: ExtendedRequest, res) => {
      const { user_id, description } = req.body;
      const image = req.file.path;
      try {
        const project = await Project.create({
          user_id,
          description,
          image,
        });

        res.json({
          project,
        });
        logger.info(`${req.id} Project Post Successful`);
        return project;
      } catch (err) {
        logger.error(err.message);
        return err;
      }
    }
  );

  router.get("/", async (req, res) => {
    const arr: Project[] = await Project.findAll();
    res.json({
      projects: arr,
    });
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const arr: Project[] = await Project.findAll({ where: { user_id: id } });
    res.json({
      projects: arr,
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

  router.delete(":id", async (req, res) => {
    const { id } = req.params;
    try {
      await Project.destroy({ where: { id } });
      return res.send("Successfully Exterminated");
    } catch (err) {
      logger.error(err.message);
      return err;
    }
  });

  return router;
};

export default projectRouter;
