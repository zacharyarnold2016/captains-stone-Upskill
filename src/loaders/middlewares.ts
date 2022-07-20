import expressRequestId from "express-request-id";
import express from "express";
import { Loader } from "../interfaces/general";

const loadMiddlewares: Loader = (app, context) => {
  app.use(expressRequestId());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
};

export default loadMiddlewares;
