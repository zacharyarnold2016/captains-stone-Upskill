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

    res.json({
      experience,
    });
    logger.info(`${user_id} Experience Post Successful`);
    await RedisService.clearCache(`cv${user_id}`);
  } catch (err) {
    logger.error(err.message);
  }
};

const getAllExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  const arr: Experience[] = await Experience.findAll();
  res.json({
    experiences: arr,
  });
};

const getOneExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const arr: Experience = await Experience.findOne({
    where: { id },
  });

  res.json({
    experience: arr,
  });
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
    const newExperience: [number, Experience[]] = await Experience.update(
      update,
      { where: { id } }
    );
    const retExperience: Experience = await Experience.findOne({
      where: { id },
    });
    const { user_id } = experience;
    await RedisService.clearCache(`cv${user_id}`);
    res.send(retExperience);
  } catch (err) {
    logger.error(err.message);
    res.status(505).send("An Internal Error Occured");
  }
};

const deleteExperience = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Experience.findOne({ where: { id } });
    if (result) {
      const { user_id } = result;
      await Experience.destroy({ where: { id } });
      await RedisService.clearCache(`cv${user_id}`);
    }
    return res.send("Successfully Exterminated");
  } catch (err) {
    logger.error(err.message);
    res.status(505).send("An Internal Error Occured");
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
