export type SerpApiOrganicResult = {
  position: number;
  title: string;
  link: string;
  redirect_link: string;
  displayed_link: string;
  thumbnail: string;
  favicon: string;
  snippet: string;
  snippet_highlighted_words: string[];
  sitelinks?: {
    inline?: Array<{
      title: string;
      link: string;
    }>;
  };
  source: string;
};
