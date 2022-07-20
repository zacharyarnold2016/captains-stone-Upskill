import express from "express";
import { RouterFactory } from "../interfaces/general";
import logger from "../libs/logger";

const userRouter: RouterFactory = () => {
  const router = express.Router();

  // Create User
  router.post("/", (req, res) => {
    logger.info(req.body);
    res.send(req.body);
  });

  // Get paginated groups of users
  router.get("/", (req, res) => {
    logger.info(req.body);
    res.send(req.body);
  });

  // Get individiual User Via ID
  router.get("/:id", (req, res) => {
    logger.info(req.body);
    res.send(req.body);
  });

  // Updates User (I'm using put because it's in the doc, would use patch)
  router.put("/:id", (req, res) => {
    logger.info(req.body);
    res.send(req.body);
  });

  // Admin Locked Delete Method
  router.delete("/:id", (req, res) => {
    logger.info("deleted");
    res.send("req.body");
  });
  return router;
};

const empty = () => {
  logger.info("Is or isnt admin");
};

export default userRouter;
