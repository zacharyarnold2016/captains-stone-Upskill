import { NextFunction, Response } from "express";
import { query, param, body, validationResult } from "express-validator";
import { ExtendedRequest } from "../interfaces/express";
import { UserRole } from "../models/user.model";

const errorResponse = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

const userValidate = [
  body("email").trim().toLowerCase().isLength({ min: 5 }).isEmail().escape(),
  body("firstName").trim().isLength({ min: 3 }).escape(),
  body("lastName").trim().isLength({ min: 3 }).escape(),
  body("title").isLength({ min: 3 }).escape(),
  body("summary").isLength({ min: 5, max: 255 }).escape(),
  body("password").trim().isLength({ min: 8 }),
  body("role")
    .toUpperCase()
    .isLength({ min: 4 })
    .escape()
    .custom((value) => {
      if (value !== UserRole.ADMIN && value !== UserRole.USER) {
        return false;
      }
      return true;
    }),
];

const loginValidate = [
  body("email").trim().toLowerCase().isLength({ min: 5 }).isEmail().escape(),
  body("password").trim().isLength({ min: 5 }).escape(),
];

const experienceValidate = [
  body("user_id").isNumeric().escape().exists(),
  body("company_name").isLength({ min: 3, max: 127 }).exists().escape(),
  body("role").isLength({ min: 3, max: 255 }).exists().escape(),
  body("startDate").exists().escape().isDate(),
  body("endDate").exists().escape().isDate(),
  body("description").exists().escape().isLength({ min: 3, max: 255 }),
];

const feedbackValidate = [
  body("from_user").exists().escape().isNumeric(),
  body("to").exists().escape().isNumeric(),
  body("content").isString().isLength({ min: 3, max: 255 }).exists().escape(),
  body("company_name")
    .isString()
    .isLength({ min: 3, max: 127 })
    .exists()
    .escape(),
];

const projectValidate = [
  body("user_id").isNumeric().exists().escape(),
  body("image").isString().exists().escape(),
  body("description")
    .exists()
    .isString()
    .isLength({ min: 3, max: 255 })
    .escape(),
];

const pathIdValidate = [param("id").isNumeric().exists().escape()];

const pathUserIdValidate = [param("userId").isNumeric().exists().escape()];

const jwtVerify = [query("token").exists().escape()];

const queryVerify = [
  query("pageSize").escape().trim().isNumeric(),
  query("page").escape().trim().isNumeric(),
  query("query").escape().trim().isAlphanumeric(),
  query("target").escape().trim().isAlphanumeric(),
];

export {
  userValidate,
  feedbackValidate,
  projectValidate,
  experienceValidate,
  errorResponse,
  pathIdValidate,
  pathUserIdValidate,
  jwtVerify,
  loginValidate,
  queryVerify
};
