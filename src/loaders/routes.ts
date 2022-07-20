import express from "express";
import { Context } from "../interfaces/general";
import makeAuthRouter from "../routes/auth";

const loadRoutes = (app: express.Router, context: Context) => {
  app.use("/api/auth", makeAuthRouter(context));
};

export default loadRoutes;
