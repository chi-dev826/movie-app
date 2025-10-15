// 視聴プロバイダー型定義
export type WatchProvider = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};

export type RegionalWatchProviders = {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
};

export type WatchProvidersByCountry = {
  [countryCode: string]: RegionalWatchProviders;
};

export type MovieWatchProvidersResponse = {
  id: number;
  results: WatchProvidersByCountry;
};
