/**
 * 配信プロバイダ表示から除外する対象
 * 広告付きプランや Amazon Channel 経由の重複プロバイダを除外する
 */
export const EXCLUDED_PROVIDERS = [
  "Amazon Prime Video with Ads",
  "Netflix Standard with Ads",
  "dAnime Amazon Channel",
  "Anime Times Amazon Channel",
  "Apple TV Amazon Channel",
  "HBO Max on U-Next",
  "FOD Channel Amazon Channel",
] as const;
