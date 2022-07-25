import { Response } from "express";

import Project from "../models/project.model";
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
    return project;
  } catch (err) {
    logger.error(err.message);
    return err;
  }
};

const getAllProjects = async (req: ExtendedRequest, res: Response) => {
  const arr: Project[] = await Project.findAll();
  res.json({
    projects: arr,
  });
};

const getOneProject = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const project: Project = await Project.findOne({ where: { user_id: id } });
  res.json({
    project,
  });
};

const updateOneProject = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const update = req.body;
  const project = await Project.findOne({ where: { id } });
  if (!project) {
    logger.error("No User found");
    res.status(404).send("An Error Occured");
  }
  try {
    const newProject = await Project.update(update, { where: { id } });
    const { user_id } = project;
    await RedisService.clearCache(`cv${user_id}`);
    res.send(newProject);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("An Internal Error Occured");
  }
};

const deleteProject = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Project.findOne({ where: { id } });
    const { user_id } = result;
    if (result) {
      await Project.destroy({ where: { id } });
      await RedisService.clearCache(`cv${user_id}`);
      return res.send("Successfully Exterminated");
    }
  } catch (err) {
    logger.error(err.message);
    return err;
  }
};

export {
  createProject,
  getAllProjects,
  getOneProject,
  updateOneProject,
  deleteProject,
};
