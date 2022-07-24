import { Sequelize } from "sequelize";
import { Experience } from "../models/experience.model";
import Feedback from "../models/feedback.model";
import Project from "../models/project.model";
import { Models } from "../interfaces/general";
import { User } from "../models/user.model";
import { initializeAdmin } from "../migrations/2021.09.30T19.59.32.users-schema";

const loadModels = async (sequelize: Sequelize): Promise<Models> => {
  const models: Models = {
    user: User,
    project: Project,
    feedback: Feedback,
    experience: Experience,
  };

  for (const model of Object.values(models)) {
    model.defineSchema(sequelize);
  }

  for (const model of Object.values(models)) {
    model.associate(models, sequelize);
  }

  await initializeAdmin();

  return models;
};

export default loadModels;
