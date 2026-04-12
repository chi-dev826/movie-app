export interface ICacheRepository {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * キャッシュから値を取得し、存在しなければ fetcher で取得して保存する
   * @param key - キャッシュキー
   * @param fetcher - キャッシュミス時に実行されるデータ取得関数
   * @param ttl - キャッシュの有効期限（秒）。省略時はデフォルト TTL を使用
   */
  getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T>;
}
