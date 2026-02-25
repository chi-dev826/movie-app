import { MovieEntity } from "../models/movie";
import { DateUtils } from "../../utils/date";
import { IClock } from "../repositories/clock.service.interface";
import { TMDB_CONFIG } from "../constants/tmdbConfig";
import { DiscoverMovieParams } from "../../../../shared/types/external/tmdb";
import { MOVIE_RULES } from "../constants/movieRules";

export class UpcomingMovieService {
  constructor(private readonly clock: IClock) {}

  /**
   * JST基準での今日の日付（時刻なし）を取得する
   */
  public getJstToday(): Date {
    const now = this.clock.now();
    // UTC時刻に9時間（JSTオフセット）を加えてJST時刻のDateオブジェクトを擬似的に作成
    const jstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    // JSTの年月日をUTCメソッドで取得
    const year = jstTime.getUTCFullYear();
    const month = jstTime.getUTCMonth();
    const day = jstTime.getUTCDate();

    // JSTの「今日」の始まり（00:00:00）を表すDateオブジェクトをUTCで作成
    return new Date(Date.UTC(year, month, day, 0, 0, 0));
  }

  /**
   * TMDB検索用のパラメータ（期間指定）を生成する
   */
  public getSearchPeriodParams(): DiscoverMovieParams {
    const today = this.getJstToday();
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setUTCMonth(
      today.getUTCMonth() + TMDB_CONFIG.DATE.UPCOMING_MONTHS,
    );

    const formatDate = (d: Date) => {
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      ...MOVIE_RULES.UPCOMING,
      "primary_release_date.gte": formatDate(today),
      "primary_release_date.lte": formatDate(twoMonthsLater),
    };
  }

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
