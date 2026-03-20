import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Movie as MovieDTO,
  UpcomingMovie as UpcomingMovieDTO,
  MovieDetailBase as MovieDetailBaseDTO,
  MovieDetail as MovieDetailDTO,
  UpcomingMeta,
} from "../../../../shared/types/domain";
import { HeroMovie } from "../../../../shared/types/api";

/**
 * 映画データの表示・装飾ロジックを担当するプレゼンタークラス (UIの関心事)
 */
export class MoviePresenter {
  /**
   * 共通のバッジ情報計算を行い UpcomingMeta を返却する
   */
  private static getUpcomingMeta(
    releaseDateStr: string | null,
    today: Date,
  ): UpcomingMeta {
    const todayClone = new Date(today);
    todayClone.setUTCHours(0, 0, 0, 0);

    const daysUntil = this.calculateDaysUntilRelease(releaseDateStr, todayClone);
    const isUpcoming = daysUntil !== null && daysUntil >= 0;

    return {
      release_date_display: this.getDisplayDate(releaseDateStr),
      days_until_release: isUpcoming ? daysUntil : null,
      upcoming_badge_label: isUpcoming ? this.getBadgeLabel(daysUntil) : null,
      release_date_short: this.getShortDate(releaseDateStr),
    };
  }

  /**
   * DTO に UI 固有の装飾（バッジ、フォーマット済み日付）を付与して UpcomingMovie を構築する
   */
  static toUpcomingMovie(dto: MovieDTO, today: Date): UpcomingMovieDTO {
    return {
      ...dto,
      ...this.getUpcomingMeta(dto.release_date ?? null, today),
    };
  }

  /**
   * 金額を日本円（億円・万円）にフォーマットする
   */
  private static formatToYen(usdAmount: number, exchangeRate = 150): string {
    if (!usdAmount || usdAmount === 0) return "-";
    const yen = usdAmount * exchangeRate;
    
    if (yen >= 100_000_000) {
      return `約${Math.round(yen / 100_000_000).toLocaleString()}億円`;
    }
    return `約${Math.round(yen / 10_000).toLocaleString()}万円`;
  }

  /**
   * 詳細 DTO に UI 固有の装飾を付与して装飾済み MovieDetailDTO を構築する
   */
  static toMovieDetail(
    dto: MovieDetailBaseDTO,
    today: Date,
  ): MovieDetailDTO {
    return {
      ...dto,
      ...this.getUpcomingMeta(dto.release_date, today),
      revenue_jpy_display: this.formatToYen(dto.revenue),
      budget_jpy_display: this.formatToYen(dto.budget),
    };
  }

  /**
   * ホーム画面のヒーローセクション用に異なるカテゴリの映画をミックスする
   */
  static toHomeHeroList(
    upcoming: UpcomingMovieDTO[],
    nowPlaying: MovieDTO[],
    recentlyAdded: MovieDTO[],
    maxCount = 8,
  ): HeroMovie[] {
    const tagged = [
      this.tagMovies(nowPlaying, "now_playing", 4),
      this.tagMovies(recentlyAdded, "recently_added", 4),
      this.tagMovies(upcoming, "upcoming", 4),
    ];

    const filtered = tagged.map((list) =>
      list.filter((m) => m.backdrop_path && m.overview?.trim()),
    );

    const result: HeroMovie[] = [];
    const seen = new Set<number>();
    const maxLen = Math.max(...filtered.map((l) => l.length));

    for (let i = 0; i < maxLen && result.length < maxCount; i++) {
      for (const list of filtered) {
        if (
          i < list.length &&
          !seen.has(list[i].id) &&
          result.length < maxCount
        ) {
          seen.add(list[i].id);
          result.push(list[i]);
        }
      }
    }

    return result;
  }

  /**
   * カテゴリタグを付与し、指定件数に絞る
   */
  private static tagMovies(
    movies: MovieDTO[],
    category: HeroMovie["category"],
    count: number,
  ): HeroMovie[] {
    return movies.slice(0, count).map((m) => ({ ...m, category }));
  }

  private static calculateDaysUntilRelease(
    releaseDateStr: string | null,
    today: Date,
  ): number | null {
    if (!releaseDateStr) return null;
    try {
      const [year, month, day] = releaseDateStr.split("-").map(Number);
      const releaseDate = new Date(Date.UTC(year, month - 1, day));
      const diffTime = releaseDate.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  }

  private static getBadgeLabel(daysUntil: number | null): string | null {
    if (daysUntil === null) return null;
    if (daysUntil === 0) return "本日公開";
    if (daysUntil === 1) return "明日公開";
    if (daysUntil > 1 && daysUntil <= 3) return `あと${daysUntil}日`;
    return "公開予定";
  }

  private static getDisplayDate(releaseDateStr: string | null): string | null {
    if (!releaseDateStr) return null;
    try {
      const date = parseISO(releaseDateStr);
      const isCurrentYear = date.getFullYear() === new Date().getFullYear();
      const formatStr = isCurrentYear ? "M月d日(E)" : "yyyy年M月d日(E)";
      return format(date, formatStr, { locale: ja });
    } catch {
      return null;
    }
  }

  private static getShortDate(releaseDateStr: string | null): string | null {
    if (!releaseDateStr) return null;
    try {
      const date = parseISO(releaseDateStr);
      return format(date, "M/d");
    } catch {
      return null;
    }
  }
}
