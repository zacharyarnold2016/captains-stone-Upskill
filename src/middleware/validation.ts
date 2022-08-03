import { NextFunction, Response } from "express";
import { query, param, body, validationResult, check } from "express-validator";
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
  body("email")
    .trim()
    .toLowerCase()
    .isLength({ min: 5 })
    .isEmail()
    .escape()
    .withMessage("Email format is required"),
  body("firstName")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("First Name must be at least 3 characters long"),
  body("lastName")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Last Name must be at least 3 characters long"),
  body("title")
    .isLength({ min: 3 })
    .escape()
    .withMessage("Title must be at least 3 characters long"),
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
    })
    .withMessage("Role must be 'ADMIN' or 'USER'"),
];

const loginValidate = [
  body("email")
    .trim()
    .toLowerCase()
    .isLength({ min: 5 })
    .isEmail()
    .escape()
    .withMessage("Must Be an Email"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Password must be >= 5 characters"),
];

const experienceValidate = [
  body("user_id")
    .isNumeric()
    .escape()
    .exists()
    .withMessage("user_id must be a number"),
  body("company_name")
    .isLength({ min: 3, max: 127 })
    .exists()
    .escape()
    .withMessage("Company Must be at least 3 characters long"),
  body("role")
    .isLength({ min: 3, max: 255 })
    .exists()
    .escape()
    .withMessage("Role must be a minimum of 3 characters long"),
  body("startDate")
    .exists()
    .escape()
    .toDate()
    .withMessage("Must include Date: MM-DD-YYYY"),
  body("endDate")
    .exists()
    .escape()
    .toDate()
    .withMessage("Must include Date: MM-DD-YYYY"),
  body("description")
    .exists()
    .escape()
    .isLength({ min: 3, max: 255 })
    .withMessage(
      "Description can't be more than 256 characters or less than 3"
    ),
];

const feedbackValidate = [
  body("from_user")
    .exists()
    .withMessage("from_user: required field!")
    .escape()
    .isNumeric()
    .withMessage("From User must be a number"),
  body("to_user")
    .exists()
    .withMessage("To User is a required Field")
    .escape()
    .isNumeric()
    .withMessage("From User must be a number!"),
  body("content")
    .isString()
    .isLength({ min: 3, max: 255 })
    .withMessage("Content cannot exceed 255 Characters")
    .exists()
    .withMessage("Must have body"),
  body("company_name")
    .isString()
    .isLength({ min: 3, max: 127 })
    .withMessage("Company Name Cannot Exceed 127 Characters")
    .exists()
    .withMessage("Company Name is a required field"),
];

const projectValidate = [
  body("user_id").isNumeric().exists().escape(),
  body("description")
    .exists()
    .withMessage("Description Required")
    .isString()
    .isLength({ min: 3, max: 255 })
    .withMessage("Description cannot exceed 255 Characters")
    .escape(),
];

const pathIdValidate = [
  param("id")
    .isNumeric()
    .withMessage("id Must be a number")
    .exists()
    .withMessage("Must provide id!")
    .escape(),
];

const pathUserIdValidate = [
  param("userId")
    .isNumeric()
    .withMessage("userId must be a number")
    .exists()
    .withMessage("Must Provide userId field")
    .escape(),
];

const jwtVerify = [
  query("token").exists().withMessage("Must Provide JWT").escape(),
];

const queryVerify = [
  query("pageSize")
    .optional()
    .escape()
    .trim()
    .isNumeric()
    .withMessage("pageSize must be a number"),
  query("page")
    .optional()
    .escape()
    .trim()
    .isNumeric()
    .withMessage("page must be a number"),
  query("query").optional().escape().trim(),
  query("target").optional().escape().trim(),
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
  queryVerify,
};
