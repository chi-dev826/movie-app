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
}