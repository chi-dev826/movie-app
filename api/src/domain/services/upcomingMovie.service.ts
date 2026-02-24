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
    const jstNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
    );
    jstNow.setHours(0, 0, 0, 0);
    return jstNow;
  }

  /**
   * TMDB検索用のパラメータ（期間指定）を生成する
   */
  public getSearchPeriodParams(): DiscoverMovieParams {
    const today = this.getJstToday();
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(
      today.getMonth() + TMDB_CONFIG.DATE.UPCOMING_MONTHS,
    );

    // JSTの日付を YYYY-MM-DD 形式に変換
    // 注意: toISOString() はUTCになるため、JSTのDateオブジェクトのメソッドを使って手動構築する
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
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
