import { createClient } from "redis";

class RedisService {
  static client = createClient();

  static async initializeClient() {
    await RedisService.client.connect();
  }

  static async setCache(key, value) {
    const val = JSON.stringify(value);
    const a = await RedisService.client.set(key, val);
  }

  static async getCache(key) {
    const a = await RedisService.client.get(key);
    const value = JSON.parse(a);
    return value;
  }

  // static async update() {}
}

export default RedisService;
