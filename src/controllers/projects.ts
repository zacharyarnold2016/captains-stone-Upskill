import { Response } from "express";

import { getPagingData, getPagination } from "../services/page.service";
import { Project } from "../models/project.model";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";
import RedisService from "../services/redis.service";

const createProject = async (req: ExtendedRequest, res: Response) => {
  const { user_id, description } = req.body;
  const image = req.file.path;
  try {
    const project = await Project.create({
      user_id,
      description,
      image,
    });
    await RedisService.clearCache(`cv${user_id}`);
    res.json({
      project,
    });
    logger.info(`${req.id} Project Post Successful`);
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
  return 1;
};

const getAllProjects = async (req: ExtendedRequest, res: Response) => {
  try {
    const { page, pageSize, query, target } = req.query;
    // @ts-ignore
    const pageInt = parseInt(page, 10);
    // @ts-ignore
    const { limit, offset } = getPagination(pageInt, pageSize);
    if (!query) {
      const data: Project[] = await Project.findAndCountAll({ limit, offset });
      if (!data) {
        res.status(404).json({ error: "No Projects Found!" });
      }
      const response = getPagingData(data, pageInt, limit);
      res.json({ feedback: response });
    } else {
      const condition = { [query]: target };
      const data = await Project.findAndCountAll({ where: condition });
      if (!data) {
        res.status(404).json({ error: "No Feedback Found" });
      }
      const response = getPagingData(data, pageInt, limit);
      res.json({ projects: response });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

const getOneProject = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project: Project = await Project.findOne({ where: { user_id: id } });
    if (!project) {
      res.status(404).json({ error: "No Project Found!" });
    } else {
      res.json({
        project,
      });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({
      error: err.message,
    });
  }
};

const updateOneProject = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const project = await Project.findOne({ where: { id } });

    if (!project) {
      res.status(404).json({ error: "Project not Found" });
    } else {
      await Project.update(update, { where: { id } });
      const newProject = await Project.findOne({ where: { id } });
      const { user_id } = project;
      await RedisService.clearCache(`cv${user_id}`);
      res.json({ project: newProject });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

const deleteProject = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Project.findOne({ where: { id } });
    if (!result) {
      res.status(404).json({ error: "Project not found!" });
    } else {
      const { user_id } = result;
      await Project.destroy({ where: { id } });
      await RedisService.clearCache(`cv${user_id}`);
      res.json({ message: "deleted" });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

export {
  createProject,
  getAllProjects,
  getOneProject,
  updateOneProject,
  deleteProject,
};
