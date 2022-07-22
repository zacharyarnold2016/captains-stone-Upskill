import { Response } from "express";

import Project from "../models/project.model";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";

const createProject = async (req: ExtendedRequest, res: Response) => {
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
};

const getAllProjects = async (req: ExtendedRequest, res: Response) => {
  const arr: Project[] = await Project.findAll();
  res.json({
    projects: arr,
  });
};

const getOneProject = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const arr: Project[] = await Project.findAll({ where: { user_id: id } });
  res.json({
    projects: arr,
  });
};

const updateOneProject = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const update = req.body;
  const user = await Project.findOne({ where: { id } });
  if (!user) {
    logger.error("No User found");
    res.status(404).send("An Error Occured");
  }
  try {
    const newUser = await Project.update(update, { where: { id } });
    res.send(newUser);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("An Internal Error Occured");
  }
};

const deleteProject = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await Project.destroy({ where: { id } });
    res.send("Successfully Exterminated");
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
