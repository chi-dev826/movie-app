export type SerpApiOrganicResult = {
  title: string;
  link: string;
  snippet?: string;
  thumbnail?: string;
  source?: string;
};

export type SerpApiResponse = {
  organic_results: SerpApiOrganicResult[];
};
