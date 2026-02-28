import { VIDEO_SITE, VIDEO_TYPE } from "../constants/video";
export class Video {
  constructor(
    private readonly key: string,
    private readonly site: string,
    private readonly type: string,
  ) {
    // TMDB は YouTube 以外の動画サイト（Vimeo 等）を返すことがあるが、
    // 本アプリでは YouTube 埋め込みのみサポートするため不正な入力として扱う
    if (this.site !== VIDEO_SITE.YOUTUBE) {
      throw new Error(`Unsupported video site: ${this.site}`);
    }

    Object.freeze(this);
  }

  getKey(): string {
    return this.key;
  }

  getSite(): string {
    return this.site;
  }

  getType(): string {
    return this.type;
  }

  /**
   * この動画がYouTubeの（TrailerまたはTeaser）であるかを判定する
   * どちらも予告編として扱う
   */
  isTrailer(): boolean {
    return this.type === VIDEO_TYPE.TRAILER || this.type === VIDEO_TYPE.TEASER;
  }
}
