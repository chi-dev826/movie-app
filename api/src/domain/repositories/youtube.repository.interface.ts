/**
 * YouTubeに関連するドメイン操作を定義したインターフェース
 */
export interface YoutubeRepositoryInterface {
  /**
   * 指定された動画キーに対応するYouTube動画が公開されているかを取得する
   */
  getVideoStatus(key: string): Promise<boolean>;
}
