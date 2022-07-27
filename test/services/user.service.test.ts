import userCleanUp from "../../src/services/user.service";

describe("User Services", () => {
  describe("userCleanUp", () => {
    it("Should, Given a large list of parameters, only return {id, firstName, lastName, image, title, summary, role, email, Experiences, Projects, Feedbacks", () => {
      const body = {
        dataValues: {
          id: 1,
          firstName: "Zach",
          lastName: "Arnold",
          image: "ImagePath",
          title: "Okay Dude",
          summary: "Really just trying my best",
          role: "Jr. Developer",
          email: "zacharyarnold2016@gmail.com",
          Experiences: [1, 2, 3],
          Projects: [1, 2, 3],
          Feedbacks: [1, 2, 3],
          needlessBS: "PICKLE",
          lessNeedless: "RIIIIICK",
          cringyMemes: "Cringe",
          skills: "None, None at all",
        },
      };
      expect(userCleanUp(body)).toStrictEqual({
        id: 1,
        firstName: "Zach",
        lastName: "Arnold",
        image: "ImagePath",
        title: "Okay Dude",
        summary: "Really just trying my best",
        role: "Jr. Developer",
        email: "zacharyarnold2016@gmail.com",
        Experiences: [1, 2, 3],
        Projects: [1, 2, 3],
        Feedbacks: [1, 2, 3],
      });
    });
    it("Should, Given no input, Return an Error", () => {
      expect(() => userCleanUp()).toThrowError();
    });
  });
});
