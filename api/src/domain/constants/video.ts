export const VIDEO_SITE = {
  YOUTUBE: "YouTube",
} as const;

export const VIDEO_TYPE = {
  TRAILER: "Trailer",
  TEASER: "Teaser",
} as const;

export type VideoSite = (typeof VIDEO_SITE)[keyof typeof VIDEO_SITE];
export type VideoType = (typeof VIDEO_TYPE)[keyof typeof VIDEO_TYPE];
