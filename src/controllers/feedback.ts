import { Response } from "express";
import { Feedback } from "../models/feedback.model";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";
import RedisService from "../services/redis.service";
import { getPagination, getPagingData } from "../services/page.service";

const addFeedback = async (req: ExtendedRequest, res: Response) => {
  try {
    const { from_user, to_user, content, company_name } = req.body;
    const feedback: Feedback = await Feedback.create({
      from_user,
      to_user,
      content,
      company_name,
    });
    await RedisService.clearCache(`cv${to_user}`);
    res.json({ feedback });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

const getAllFeedback = async (req: ExtendedRequest, res: Response) => {
  try {
    const { page, pageSize, query, target } = req.query;
    const pageInt = parseInt(page, 10);
    const { limit, offset } = getPagination(pageInt, pageSize);
    if (!query) {
      const data: Feedback[] = await Feedback.findAndCountAll({
        limit,
        offset,
      });
      if (!data) {
        res.status(404).json({
          error: "No Feedback Found!",
        });
      } else {
        const response = getPagingData(data, pageInt, limit);
        res.json({ feedback: response });
      }
    } else {
      const condition = { [query]: target };
      const data = await Feedback.findAndCountAll({
        where: condition,
      });
      if (!data) {
        res.status(404).json({ error: "No Users Found" });
      } else {
        const response = getPagingData(data, pageInt, limit);
        res.json({ feedback: response });
      }
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

const getOneFeedback = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const feedback: Feedback = await Feedback.findOne({
      where: { id },
    });
    if (!feedback) {
      res.status(404).json({ error: "Feedback not found!" });
    } else {
      res.json({
        feedback,
      });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

const updateFeedback = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const feedback = await Feedback.findOne({ where: { id } });
    if (!feedback) {
      logger.error("No Feedback found");
      res.status(404).json({ error: "No Feedback Found!" });
    } else {
      const { to_user } = feedback;
      await Feedback.update(update, { where: { id } });
      await RedisService.clearCache(`cv${to_user}`);

      const newFeedback = await Feedback.findOne({ where: { id } });
      res.json({ feedback: newFeedback });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

const deleteFeedback = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Feedback.findOne({ where: { id } });
    if (!result) {
      res.status(404).json({ error: "Feedback not found!" });
    } else {
      const { to_user } = result;
      await Feedback.destroy({ where: { id } });
      await RedisService.clearCache(`cv${to_user}`);
      res.json({ message: "deleted" });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(505).json({ error: err.message });
  }
};

export {
  addFeedback,
  getAllFeedback,
  getOneFeedback,
  updateFeedback,
  deleteFeedback,
};
