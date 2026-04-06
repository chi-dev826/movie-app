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
    public readonly mediaType?: string,
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

  /**
   * 概要文の整合性をチェックする (ビジネスルール)
   * @description 概要文が欠損している映画は、UI上での表示に適さない「不完全なデータ」として扱う。
   */
  public hasOverview(): boolean {
    return !!this.overview;
  }

  /**
   * タイトルが日本市場向けに提供されているか（邦画、またはローカライズ済み）を判定する
   * @description
   * 1. 邦画 (ja) は常に許可。
   * 2. タイトルまたは概要に「かな（ひらがな・カタカナ）」が含まれていれば、翻訳済みと判断し許可。
   *    ※日本で一般公開される作品は、タイトルが英語のままでも概要文が翻訳されているため、この基準でマイナーな未翻訳作品を排除可能。
   * 3. それ以外（かなを含まない漢字のみ、または純粋な外国語）は除外。
   */
  public isMostlyJapanese(): boolean {
    if (!this.title) return false;

    // 1. 邦画は無条件で許可
    if (this.originalLanguage === "ja") return true;

    // 2. タイトルまたは概要に「かな（ひらがな・カタカナ）」が含まれているかチェック
    // 日本で一般に認知・公開される外国映画は、タイトルが英語のままでも概要文は日本語化されていることが多いため、
    // 両方をチェックすることで「JOKER」のようなメジャー作品を維持しつつ、マイナーな英語作品を弾くことができます。
    const hasKanaInTitle = /[\u3040-\u309F\u30A0-\u30FF]/.test(this.title);
    const hasKanaInOverview = /[\u3040-\u309F\u30A0-\u30FF]/.test(
      this.overview,
    );

    return hasKanaInTitle || hasKanaInOverview;
  }

  /**
   * 映画が公開済みかどうかを判定する（ビジネスルール）。
   * @description TMDBは配信契約の確定時点でwatchProvidersを返すが、
   * 実際の配信開始日は提供されない。この判定を用いて、未公開作品に対する
   * 配信情報の提供可否をユースケース層で制御する。
   * releaseDateが不明な場合は未公開として扱う（安全側に倒す）。
   */
  public isReleased(today: Date): boolean {
    if (!this.releaseDate) return false;
    const release = new Date(this.releaseDate);
    return release < today;
  }
}
