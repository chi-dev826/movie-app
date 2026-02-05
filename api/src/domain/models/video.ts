export class Video {
  constructor(
    public readonly key: string,
    public readonly site: string,
    public readonly type: string,
  ) {}

  getKey(): string {
    return this.key;
  }

  getSite(): string {
    return this.site;
  }

  getType(): string {
    return this.type;
  }

  /**
   * この動画がYouTubeの予告編であるかを判定する
   */
  isTrailer(): boolean {
    return this.site === "YouTube" && this.type === "Trailer";
  }
}
