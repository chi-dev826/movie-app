import { MovieEntity } from "../models/movie";
import { DateUtils } from "../../utils/date";

export class UpcomingMovieService {
  /**
   * 公開日が近い順にソートする
   * 公開日未定(null)は末尾へ
   */
  public sort(movies: readonly MovieEntity[]): MovieEntity[] {
    return [...movies].sort((a, b) => {
      const dateA = a.releaseDate || "9999-12-31";
      const dateB = b.releaseDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
  }

  /**
   * 公開までの残り日数を計算する (JST基準)
   */
  public calculateDaysUntilRelease(
    movie: MovieEntity,
    today: Date,
  ): number | null {
    if (!movie.releaseDate) return null;
    const releaseDate = new Date(`${movie.releaseDate}T00:00:00+09:00`);
    const diffTime = releaseDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * 残り日数に応じたバッジラベルを取得する
   */
  public getBadgeLabel(daysUntil: number | null): string | null {
    if (daysUntil === null) return null;
    if (daysUntil === 0) return "本日公開";
    if (daysUntil === 1) return "明日公開";
    if (daysUntil > 1 && daysUntil <= 3) return `あと${daysUntil}日`;
    return null;
  }

  /**
   * 表示用日付文字列を取得する
   */
  public getDisplayDate(movie: MovieEntity): string | null {
    return movie.releaseDate
      ? DateUtils.formatReleaseDateToJa(movie.releaseDate)
      : null;
  }
}
