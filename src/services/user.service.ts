// Function to Filter Out Sensitive / Unneccesary Information
const userCleanUp = (body) => {
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
