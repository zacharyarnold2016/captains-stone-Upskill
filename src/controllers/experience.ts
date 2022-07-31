import { Response } from "express";
import { Experience } from "../models/experience.model";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";
import RedisService from "../services/redis.service";
import { getPagination, getPagingData } from "../services/page.service";

const addExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  // eslint-disable-next-line
  try {
    const { user_id, company_name, role, startDate, endDate, description } =
      req.body;
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
    res.status(505).json({ error: err.message });
  }
};

const getAllExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  try {
    const { page, pageSize, query, target } = req.query;
    const pageInt = parseInt(page, 10);
    const { limit, offset } = getPagination(pageInt, pageSize);
    if (!query) {
      const data: Experience[] = await Experience.findAndCountAll({
        limit,
        offset,
      });
      if (!data) {
        logger.warn(`Unsuccessful Experience Query from user ${req.id}`);
        res.status(404).json({ message: "Experiences not Found!" });
      }
      const response = getPagingData(data, pageInt, limit);
      res.json({
        experiences: response,
      });
    } else {
      const condition = { [query]: target };
      const data = await Experience.findAndCountAll({
        where: condition,
      });
      if (!data) {
        res.status(404).json({ error: "No Experiences Found!" });
      }
      const response = getPagingData(data, pageInt, limit);
      res.json({ experiences: response });
    }
  } catch (err) {
    logger.error(`${req.id}, Internal Error occured`);
    res.status(505).json({ error: err.message });
  }
};

const getOneExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const arr: Experience = await Experience.findOne({
      where: { id },
    });

    if (!arr) {
      res.status(404).json({ message: `Experience not found!` });
    }
    res.json({
      experience: arr,
    });
  } catch (err) {
    res.status(505).json({ error: err.message });
  }
};

const updateExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const update = req.body;
    const experience: Experience = await Experience.findOne({ where: { id } });

    if (!experience) {
      logger.error("No Experience found");
      res.status(404).json({ error: "No Experience Found!" });
    }

    await Experience.update(update, { where: { id } });
    const retExperience: Experience = await Experience.findOne({
      where: { id },
    });

    const { user_id } = experience;
    await RedisService.clearCache(`cv${user_id}`);
    res.json({ experience: retExperience });
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

const deleteExperience = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Experience.findOne({ where: { id } });
    if (!result) {
      res.status(404).json({
        error: "Experience not found!",
      });
    }
    const { user_id } = result;
    await Experience.destroy({ where: { id } });
    await RedisService.clearCache(`cv${user_id}`);
    res.json({ message: "deleted" });
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
    return err;
  }
  return 1;
};
export {
  addExperience,
  getAllExperience,
  getOneExperience,
  updateExperience,
  deleteExperience,
};
