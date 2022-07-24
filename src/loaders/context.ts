import RedisService from "../services/redis.service";
import { Context } from "../interfaces/general";
import AuthService from "../services/auth.service";

const loadContext = async (): Promise<Context> => ({
  services: {
    authService: new AuthService(),
    redisService: new RedisService(),
  },
});

export default loadContext;
