import { MovieEntity } from "../models/movie";
import { IClock } from "../repositories/clock.service.interface";

/**
 * 近日公開映画に関するドメインロジックを提供するサービス。
 *
 * @description
 * 検索パラメータの構築（APIの仕様に依存する処理）はリポジトリに委譲し、
 * 本サービスはソートや日付計算などの純粋なビジネスルールに特化する。
 */
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
   * 公開日が近い順にソートする (ドメイン的順序)
   */
  public sort(movies: readonly MovieEntity[]): MovieEntity[] {
    return [...movies].sort((a, b) => {
      const dateA = a.releaseDate || "9999-12-31";
      const dateB = b.releaseDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
  }
}
