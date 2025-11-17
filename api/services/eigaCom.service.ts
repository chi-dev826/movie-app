import { ScrapeEigaComClient } from "../lib/scrapeEigaComClient";
import { Article } from "@/types/domain";

export class EigaComService {
  private readonly scrapeEigaComClient: ScrapeEigaComClient;

  constructor(scrapeEigaComClient: ScrapeEigaComClient) {
    this.scrapeEigaComClient = scrapeEigaComClient;
  }

  async getEigaComNews(movieTitle: string): Promise<Article[]> {
    const articles = await this.scrapeEigaComClient.searchNews(movieTitle);
    return articles;
  }
}
