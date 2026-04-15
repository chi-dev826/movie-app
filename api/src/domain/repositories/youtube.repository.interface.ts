/**
 * YouTubeに関連するドメイン操作を定義したインターフェース
 */
export interface IYoutubeRepository {
  /**
   * 指定された動画キーに対応するYouTube動画が公開されているかを取得する
   */
  getPublicVideoKeys(keys: string[]): Promise<string[]>;
}
