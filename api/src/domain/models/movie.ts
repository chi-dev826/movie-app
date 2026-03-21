export class MovieEntity {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly originalTitle: string,
    public readonly originalLanguage: string,
    public readonly overview: string,
    public readonly posterPath: string | null,
    public readonly backdropPath: string | null,
    public readonly releaseDate: string | null, // YYYY-MM-DD
    public readonly voteAverage: number | null,
    public readonly genreIds: readonly number[] = [],
  ) {
    if (new.target === MovieEntity) {
      Object.freeze(this);
      Object.freeze(this.genreIds);
    }
  }

  /**
   * 画像情報の整合性をチェックする (ビジネスルール)
   * @description 画像が欠損している映画は、UI上での表示に適さない「不完全なデータ」として扱う。
   */
  public hasValidImages(): boolean {
    return !!(this.posterPath && this.backdropPath);
  }

  public isMostlyJapanese(): boolean {
    if (this.title.length === 0) return false;
    if (this.originalLanguage !== "ja" && this.originalLanguage !== "en")
      return false;
    const jpChars = this.title.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g) || [];
    return jpChars.length / this.title.length > 0.3;
  }

  /**
   * 日本向けタイトルが存在するかチェックする
   * @description TMDBから取得したデータに日本語タイトル（title属性）が設定されているかを確認する
   */
  public isLocalized(): boolean {
    return !!this.title;
  }
}
