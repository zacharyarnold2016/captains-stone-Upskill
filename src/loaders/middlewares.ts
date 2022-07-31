import expressRequestId from "express-request-id";
import express from "express";
import { Loader } from "../interfaces/general";
import errorHandler from "../middleware/errorHandler";

const loadMiddlewares: Loader = (app, context) => {
  app.use(expressRequestId());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(errorHandler);
};

export default loadMiddlewares;
