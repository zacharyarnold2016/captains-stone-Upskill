import { User } from "../models/user.model";

// Function to Filter Out Sensitive / Unneccesary Information
const userCleanUp = (body: User) => {
  if (!body) {
    throw new Error("Cleanup Error, Must have user!");
  }
  // @ts-ignore
  const user = body.dataValues;
  const {
    id,
    firstName,
    lastName,
    image,
    title,
    summary,
    role,
    email,
    Experiences,
    Projects,
    Feedbacks,
  } = user;

  const retUser = {
    id,
    firstName,
    lastName,
    image,
    title,
    summary,
    role,
    email,
    Experiences,
    Projects,
    Feedbacks,
  };

  return retUser;
};

export default userCleanUp;
