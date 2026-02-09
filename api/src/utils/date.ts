export class DateUtils {
  /**
   * YYYY-MM-DD 形式の文字列を 日本語形式 (例: 2/14(金)) に整形する
   */
  static formatReleaseDateToJa(dateStr: string): string {
    const date = new Date(`${dateStr}T00:00:00+09:00`);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    return `${month}月${day}日(${dayOfWeek})`;
  }

  /**
   * JST基準での今日の日付（時刻なし）を取得する
   */
  static getJstToday(): Date {
    const now = new Date();
    const jstNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
    );
    jstNow.setHours(0, 0, 0, 0);
    return jstNow;
  }
}
