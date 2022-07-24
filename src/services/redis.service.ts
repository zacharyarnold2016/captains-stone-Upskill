import { createClient } from "redis";

class RedisService {
  static client = createClient();

  static async initializeClient() {
    await RedisService.client.connect();
  }

  static async setCache() {
    await RedisService.client.set("key", "value");
  }

  static async cache() {
    const a = await RedisService.client.get("key");
    return a;
  }
}

export default RedisService;
