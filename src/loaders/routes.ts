import express from "express";
import feedRouter from "../routes/feedback";
import expRouter from "../routes/experience";
import { Context } from "../interfaces/general";
import makeAuthRouter from "../routes/auth";
import projectRouter from "../routes/projects";

const loadRoutes = (app: express.Router, context: Context) => {
  app.use("/api/auth", makeAuthRouter(context));
  app.use("/api/experience", expRouter(context));
  app.use("/api/feedback", feedRouter(context));
  app.use("/api/projects", projectRouter(context));
};

export default loadRoutes;
