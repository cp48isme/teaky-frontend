import { apiRequest } from './client';
import type { ScrapeWebsiteResponse } from '../types/scraping';

export async function scrapeWebsite(
  url: string,
): Promise<ScrapeWebsiteResponse> {
  return apiRequest<ScrapeWebsiteResponse>('/scrape/website', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}
