import { ScrapeEigaComClient } from "../lib/scrapeEigaComClient";
import { NewsItem } from "@/types/domain";

export class EigaComService {
  private readonly scrapeEigaComClient: ScrapeEigaComClient;

  constructor(scrapeEigaComClient: ScrapeEigaComClient) {
    this.scrapeEigaComClient = scrapeEigaComClient;
  }

  async getEigaComNews(movieTitle: string): Promise<NewsItem[]> {
    const newsItems = await this.scrapeEigaComClient.searchNews(movieTitle);
    return newsItems;
  }
}
