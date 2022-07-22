import { Response } from "express";
import Feedback from "../models/feedback.model";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";

const addFeedback = async (req: ExtendedRequest, res: Response) => {
  const { from_user, to_user, content, company_name } = req.body;
  try {
    const feedback: Feedback = await Feedback.create({
      from_user,
      to_user,
      content,
      company_name,
    });
    return res.send(feedback);
  } catch (err) {
    logger.error(err);
    return err;
  }
};

const getAllFeedback = async (req: ExtendedRequest, res: Response) => {
  const arr: Feedback[] = await Feedback.findAll();
  res.json({
    feedback: arr,
  });
};

const getOneFeedback = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const arr: Feedback[] = await Feedback.findAll({
    where: { to_user: id },
  });

  res.json({
    feedback: arr,
  });
};

const updateFeedback = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const update = req.body;
  const user = await Feedback.findOne({ where: { id } });
  if (!user) {
    logger.error("No User found");
    res.status(404).send("An Error Occured");
  }
  try {
    const newUser = await Feedback.update(update, { where: { id } });
    res.send(newUser);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("An Internal Error Occured");
  }
};

const deleteFeedback = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await Feedback.destroy({ where: { id } });
    return res.send("Successfully Exterminated");
  } catch (err) {
    logger.error(err.message);
    return err;
  }
};

export {
  addFeedback,
  getAllFeedback,
  getOneFeedback,
  updateFeedback,
  deleteFeedback,
};
