import RedisService from "../services/redis.service";

const loadRedis = async () => {
  await RedisService.initializeClient();
};

export default loadRedis;
