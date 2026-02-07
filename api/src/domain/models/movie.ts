import { Movie as MovieDTO } from "../../../../shared/types/domain";

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
    private _logoPath: string | null = null,
    private _videoKey: string | null = null,
  ) {}

  public setLogo(path: string | null): void {
    this._logoPath = path;
  }

  public setVideo(key: string | null): void {
    this._videoKey = key;
  }

  public get videoKey(): string | null {
    return this._videoKey;
  }

  public isMostlyJapanese(): boolean {
    if (this.originalLanguage !== "ja" && this.originalLanguage !== "en")
      return false;
    const jpChars = this.title.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g) || [];
    return jpChars.length / this.title.length > 0.3;
  }

  public toDto(): MovieDTO {
    return {
      id: this.id,
      title: this.title,
      original_title: this.originalTitle,
      original_language: this.originalLanguage,
      overview: this.overview,
      poster_path: this.posterPath,
      backdrop_path: this.backdropPath,
      release_date: this.releaseDate,
      vote_average: this.voteAverage,
      logo_path: this._logoPath,
      video: this._videoKey,
    };
  }
}
