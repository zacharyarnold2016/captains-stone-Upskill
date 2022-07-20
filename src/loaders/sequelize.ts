import { Sequelize } from "sequelize";
import { Config } from "../config";

const loadSequelize = (config: Config): Sequelize =>
  new Sequelize({
    dialect: "mysql",
    ...config.db,
  });

export default loadSequelize;
