import NodeCache from "node-cache";
import { ICacheRepository } from "../../../domain/repositories/cache.repository.interface";

export class NodeCacheRepository implements ICacheRepository {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 86400) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    // null は「データが存在しないという確定結果」であり、正当なキャッシュ値として扱う
    // undefined のみが「キャッシュミス（未取得）」を意味する
    const cached = this.get<T>(key);
    if (cached !== undefined) return cached;

    const value = await fetcher();
    this.set(key, value, ttl);
    return value;
  }
}
