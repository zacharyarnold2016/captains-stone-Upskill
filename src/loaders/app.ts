import express from "express";
import loadMiddlewares from "./middlewares";
import loadRoutes from "./routes";
import loadContext from "./context";
import loadModels from "./models";
import loadSequelize from "./sequelize";
import { config } from "../config";
import loadPassport from "./passport";

const loadApp = async () => {
  const app = express();
  const sequelize = loadSequelize(config);

  loadModels(sequelize);

  const context = await loadContext();

  loadPassport(app, context);
  loadMiddlewares(app, context);
  loadRoutes(app, context);

  return app;
};

export default loadApp;
