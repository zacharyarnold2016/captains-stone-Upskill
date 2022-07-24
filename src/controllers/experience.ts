import { Response } from "express";
import { Experience } from "../models/experience.model";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";

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
    logger.info(`${req.id} Experience Post Successful`);
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
  const arr: Experience[] = await Experience.findAll({
    where: { user_id: id },
  });

  res.json({
    experiences: arr,
  });
};

const updateExperience = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const update = req.body;
  const user = await Experience.findOne({ where: { id } });
  if (!user) {
    logger.error("No User found");
    res.status(404).send("An Error Occured");
  }
  try {
    const newUser = await Experience.update(update, { where: { id } });
    res.send(newUser);
  } catch (err) {
    logger.error(err.message);
    res.status(505).send("An Internal Error Occured");
  }
};

const deleteExperience = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await Experience.destroy({ where: { id } });
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
