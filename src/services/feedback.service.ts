import { Feedback } from "../models/feedback.model";
import RedisService from "./redis.service";

export default class FeedbackService {
  static async del(feedback: Feedback, id: string) {
    const { to_user } = feedback;
    if (!to_user) {
      throw new Error("to_user Field not found");
    }
    await Feedback.destroy({ where: { id } });
    await RedisService.clearCache(`cv${to_user}`);
  }

  static async update<T>(
    feedback: Feedback,
    id: string,
    update: T
  ): Promise<Feedback> {
    const { to_user } = feedback;
    if (!to_user) {
      throw new Error("to_user Field not found");
    }
    await Feedback.update(update, { where: { id } });
    await RedisService.clearCache(`cv${to_user}`);
    const newFeedback = await Feedback.findOne({ where: { id } });
    return newFeedback;
  }

  static async create(
    from_user: number,
    to_user: number,
    content: string,
    company_name: string
  ) {
    const feedback: Feedback = await Feedback.create({
      from_user,
      to_user,
      content,
      company_name,
    });
    await RedisService.clearCache(`cv${to_user}`);
    return feedback;
  }
}
