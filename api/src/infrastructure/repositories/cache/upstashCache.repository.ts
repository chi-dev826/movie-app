import { Redis } from "@upstash/redis";
import { ICacheRepository } from "../../../domain/repositories/cache.repository.interface";

export class UpstashCacheRepository implements ICacheRepository {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.redis.get<T>(key);
    return value ?? undefined;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, { ex: ttl });
    } else {
      await this.redis.set(key, value);
    }
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    // null は「データが存在しないという確定結果」であり、正当なキャッシュ値として扱う
    // undefined のみが「キャッシュミス（未取得）」を意味する
    const cached = await this.get<T>(key);
    if (cached !== undefined) return cached;

    const value = await fetcher();
    this.set(key, value, ttl);
    return value;
  }
}
