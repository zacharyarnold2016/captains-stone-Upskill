import { Response } from "express";
import { Experience } from "../models/experience.model";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";
import RedisService from "../services/redis.service";

const addExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
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

    const update = await Experience.findAll();
    await RedisService.setCache("xp", update);

    res.json({
      experience,
    });
    logger.info(`${req.id} Experience Post Successful`);
  } catch (err) {
    logger.error(err.message);
  }
};

const getAllExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  const test = await RedisService.getCache("xp");
  if (test === null) {
    const arr: Experience[] = await Experience.findAll();
    await RedisService.setCache("xp", arr);
    res.json({
      experiences: arr,
    });
  } else {
    res.json({
      experiences: test,
    });
  }
};

const getOneExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const test = await RedisService.getCache(`xp${id}`);

  if (!test) {
    const arr: Experience[] = await Experience.findAll({
      where: { user_id: id },
    });

    await RedisService.setCache(`xp${id}`, arr);
    const update: Experience[] = await Experience.findAll();
    await RedisService.setCache("xp", update);

    res.json({
      experience: arr,
    });
  } else {
    res.json({
      experience: test,
    });
  }
};

const updateExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const update = req.body;
  const experience: Experience = await Experience.findOne({ where: { id } });
  if (!experience) {
    logger.error("No Experience found");
    res.status(404).send("An Error Occured");
  }
  try {
    const newExperience = await Experience.update(update, { where: { id } });
    await RedisService.setCache(`xp${id}`, newExperience);
    res.send(newExperience);
  } catch (err) {
    logger.error(err.message);
    res.status(505).send("An Internal Error Occured");
  }
};

const deleteExperience = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await Experience.destroy({ where: { id } });
    const update = await Experience.findAll();
    await RedisService.setCache("xp", update);
    return res.send("Successfully Exterminated");
  } catch (err) {
    logger.error(err.message);
    return err;
  }
};
export {
  addExperience,
  getAllExperience,
  getOneExperience,
  updateExperience,
  deleteExperience,
};
