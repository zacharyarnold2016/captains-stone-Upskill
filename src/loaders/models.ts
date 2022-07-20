import { Sequelize } from "sequelize";
import { Experience } from "../models/experience.model";
import { Feedback } from "../models/feedback.model";
import { Project } from "../models/project.model";
import { Models } from "../interfaces/general";
import { User } from "../models/user.model";

const loadModels = (sequelize: Sequelize): Models => {
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

  return models;
};

export default loadModels;
