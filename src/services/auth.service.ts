import jwt from "jsonwebtoken";

export default class AuthService {
  static async decodeId(token) {
    const { user } = jwt.decode(token, "TOP_SECRET");
    const { id } = user;
    return id;
  }

  static async decodeBody(token) {
    const { user } = jwt.decode(token, "TOP_SECRET");
    return user;
  }

  static async decodeRole(token) {
    const { user } = jwt.decode(token, "TOP_SECRET");
    const { role } = user;
    return role;
  }
}
