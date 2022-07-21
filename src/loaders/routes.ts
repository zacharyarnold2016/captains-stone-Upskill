import express from "express";
import expRouter from "../routes/experience";
import { Context } from "../interfaces/general";
import makeAuthRouter from "../routes/auth";

const loadRoutes = (app: express.Router, context: Context) => {
  app.use("/api/auth", makeAuthRouter(context));
  app.use("/api/experience", expRouter(context))
};

export default loadRoutes;
