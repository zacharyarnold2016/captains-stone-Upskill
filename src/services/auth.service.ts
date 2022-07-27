import jwt from "jsonwebtoken";

export default class AuthService {
  static async decodeId(token) {
    if (!token) {
      throw new Error("Token must be Provided!");
    }
    // @ts-ignore
    const { user } = jwt.decode(token, "TOP_SECRET");
    const { id } = user;
    return id;
  }

  static async decodeBody(token) {
    if (!token) {
      throw new Error("Token must be Provided!");
    }
    // @ts-ignore
    const { user } = jwt.decode(token, "TOP_SECRET");
    return user;
  }

  static async decodeRole(token) {
    if (!token) {
      throw new Error("Token must be Provided!");
    }
    // @ts-ignore a
    const { user } = jwt.decode(token, "TOP_SECRET");
    const { role } = user;
    return role;
  }
}
