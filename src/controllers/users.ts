import { Response } from "express";
import userCleanUp from "../services/user.service";
import { User } from "../models/user.model";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";
import { Experience } from "../models/experience.model";
import { Feedback } from "../models/feedback.model";
import { Project } from "../models/project.model";
import { getPagination, getPagingData } from "../services/page.service";
import RedisService from "../services/redis.service";

// Here Thar Be Ugly Code - ToDo: Cleaning
const getAllUsers = async (req: ExtendedRequest, res: Response) => {
  try {
    const { page, pageSize, query, target } = req.query;
    // @ts-ignore
    const pageInt = parseInt(page, 10);
    // @ts-ignore
    const { limit, offset } = getPagination(pageInt, pageSize);
    if (!query) {
      const data = await User.findAndCountAll({ limit, offset });
      if (!data) {
        res.status(404).json({ error: "No Users Found" });
      }
      const response = getPagingData(data, pageInt, limit);
      res.json({ users: response });
    } else {
      // @ts-ignore
      const condition = { [query]: target };
      const data = await User.findAndCountAll({
        // @ts-ignore
        where: condition,
      });
      if (!data) {
        res.status(404).json({ error: "No Users Found" });
      }
      const response = getPagingData(data, pageInt, limit);
      res.json({ users: response });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({
      error: err.message,
    });
  }
};

const getOneUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      res.status(404).json({
        error: "No User Found!",
      });
    }
    res.json({ user });
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({
      error: err.message,
    });
  }
};

const updateUser = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const update = req.body;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      logger.error("No User Found");
      res.status(404).json({ error: "No User Found" });
    }
    await User.update(update, { where: { id } });
    const newUser = await User.findOne({ where: { id } });

    res.json({ user: newUser });
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

const cv = async (req: ExtendedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await RedisService.getCache(`cv${userId}`);
    if (result === null) {
      const cover = await User.findOne({
        where: { id: userId },
        include: [Experience, Project, Feedback],
      });
      const user = userCleanUp(cover);
      await RedisService.setCache(`cv${userId}`, user);
      res.json({ user });
    } else {
      res.json({ user: result });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({
      error: err.message,
    });
  }
};

const deleteUser = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      res.status(404).json({
        error: "User not found!",
      });
    }
    await User.destroy({ where: { id } });
    res.json({ message: "deleted" });
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

export { getAllUsers, getOneUser, updateUser, cv, deleteUser };
