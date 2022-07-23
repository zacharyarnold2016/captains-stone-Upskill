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

export type RouterFactory = (context: Context) => express.Router;// eslint-ignore-line

export type Loader = (app: express.Application, context: Context) => void;// eslint-ignore-line

export interface Models {
  user: typeof User;
  project: typeof Project;
  feedback: typeof Feedback;
  experience: typeof Experience;
}

export interface passportUser {
  id: number;
  email: string;
  image: string;
}