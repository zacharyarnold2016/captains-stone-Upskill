import express from "express";
import { AuthService } from "../services/auth.service";
import { User } from "../models/user.model";
import Project from "../models/project.model";
import Feedback from "../models/feedback.model";
import { Experience } from "../models/experience.model";

export interface Context {
  services: {
    authService: AuthService;
  };
}

export type RouterFactory = (context: Context) => express.Router;

export type Loader = (app: express.Application, context: Context) => void;

export interface Models {
  user: typeof User;
  project: typeof Project;
  feedback: typeof Feedback;
  experience: typeof Experience;
}
