import axios from "axios";
import * as cheerio from "cheerio";
import { IOgpImageProvider } from "../../application/services/ogp-image-provider.interface";

/**
 * 指定されたURLからOGP画像（og:image）を取得するユーティリティ。
 * AxiosでHTMLを取得し、Cheerioでメタタグを解析する。
 */
export class OgpParser implements IOgpImageProvider {
  private readonly timeout: number;

  constructor(timeout = 1500) {
    this.timeout = timeout;
  }

  /**
   * 対象URLのHTMLからog:imageメタタグの内容を抽出する。
   * 失敗した場合やタグがない場合はnullを返す。
   */
  public async getOgpImage(url: string): Promise<string | null> {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const $ = cheerio.load(response.data);
      const ogImage =
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        $('link[rel="image_src"]').attr("href");

      if (!ogImage) return null;

      // 相対パスの場合は絶対パスに変換（簡易的）
      if (ogImage.startsWith("/")) {
        const urlObj = new URL(url);
        return `${urlObj.origin}${ogImage}`;
      }

      return ogImage;
    } catch (error) {
      // タイムアウトや404などはログに出さず、nullを返す（検索結果を壊さないため）
      return null;
    }
  }
}
