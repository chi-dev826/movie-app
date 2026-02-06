export class ArrayUtils {
  /**
   * 1から指定した数までの数値配列を生成する
   * @param size 生成する配列の長さ（最大値）
   * @example range(3) => [1, 2, 3]
   */
  static range(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i + 1);
  }
}
