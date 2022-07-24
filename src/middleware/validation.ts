import { NextFunction, Response } from "express";
import { body, validationResult } from "express-validator";
import { ExtendedRequest } from "../interfaces/express";
import { UserRole } from "../models/user.model";

const errorResponse = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
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
      if (value !== UserRole.Admin || UserRole.User) {
        return false;
      }
      return true;
    }),
];

export { userValidate, errorResponse };
