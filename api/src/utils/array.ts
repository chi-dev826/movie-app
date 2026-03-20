export class ArrayUtils {
  /**
   * 1から指定した数までの数値配列を生成する
   * @param size 生成する配列の長さ（最大値）
   * @example range(3) => [1, 2, 3]
   */
  static range(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i + 1);
  }
  /**
   * IDプロパティを持つオブジェクトの配列から重複を排除する
   */
  static deduplicate<T extends { id: number }>(items: readonly T[]): T[] {
    const uniqueMap = new Map<number, T>();
    items.forEach((item) => uniqueMap.set(item.id, item));
    return Array.from(uniqueMap.values());
  }
}
