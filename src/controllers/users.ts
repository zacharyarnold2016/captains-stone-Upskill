import { Response } from "express";
import userCleanUp from "../services/user.service";
import { User } from "../models/user.model";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";
import { Experience } from "../models/experience.model";
import Feedback from "../models/feedback.model";
import Project from "../models/project.model";
import { getPagination, getPagingData } from "../services/page.service";
import RedisService from "../services/redis.service";

const getAllUsers = async (req: ExtendedRequest, res: Response) => {
  const { page, size, query, target } = req.query;
  const pageInt = parseInt(page, 10);
  const { limit, offset } = getPagination(pageInt, size);
  if (!query) {
    const data = await User.findAndCountAll({ limit, offset });
    const response = getPagingData(data, pageInt, limit);
    res.send(response);
  } else {
    // @ts-ignore
    const condition = { [query]: target };
    const data = await User.findAndCountAll({
      // @ts-ignore
      where: condition,
    });
    const response = getPagingData(data, pageInt, limit);
    res.send(response);
  }
};

const getOneUser = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });
  res.json(user);
};

const updateUser = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const update = req.body;
  const user = await User.findOne({ where: { id } });
  if (!user) {
    logger.error("No User Found");
    res.status(404).send("An Error Occured, No user found");
  }
  try {
    const newUser = await User.update(update, { where: { id } });
    res.send(newUser);
  } catch (err) {
    res.status(505).send("An Internal Error Occured!");
  }
};

const cv = async (req: ExtendedRequest, res: Response) => {
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
};

const deleteUser = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await User.destroy({ where: { id } });
    res.send("Successfully Deleted User");
  } catch (err) {
    logger.error(err.message);
    res.status(505).send("An internal Error Occured");
  }
};

export { getAllUsers, getOneUser, updateUser, cv, deleteUser };
