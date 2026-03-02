import { apiRequest } from './client';
import type {
  QuoteRequest,
  QuoteRequestPage,
  CreateQuoteRequest,
  UpdateQuoteRequest,
} from '../types/quote';

export async function createQuote(
  portalId: string,
  data: CreateQuoteRequest,
): Promise<QuoteRequest> {
  return apiRequest<QuoteRequest>(`/portals/${portalId}/quotes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listQuotes(
  portalId: string,
  params?: { status?: string; page?: number; page_size?: number },
): Promise<QuoteRequestPage> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.page_size) searchParams.set('page_size', String(params.page_size));
  const qs = searchParams.toString();
  return apiRequest<QuoteRequestPage>(
    `/portals/${portalId}/quotes${qs ? `?${qs}` : ''}`,
  );
}

export async function getQuote(
  portalId: string,
  quoteId: string,
): Promise<QuoteRequest> {
  return apiRequest<QuoteRequest>(
    `/portals/${portalId}/quotes/${quoteId}`,
  );
}

export async function updateQuote(
  portalId: string,
  quoteId: string,
  data: UpdateQuoteRequest,
): Promise<QuoteRequest> {
  return apiRequest<QuoteRequest>(
    `/portals/${portalId}/quotes/${quoteId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

// --- Slug-based portal quote APIs (for end-user portal pages) ---

export async function createPortalQuote(
  slug: string,
  data: CreateQuoteRequest,
): Promise<QuoteRequest> {
  return apiRequest<QuoteRequest>(`/p/${slug}/quotes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listPortalQuotes(
  slug: string,
  params?: { page?: number; page_size?: number },
): Promise<QuoteRequestPage> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.page_size) searchParams.set('page_size', String(params.page_size));
  const qs = searchParams.toString();
  return apiRequest<QuoteRequestPage>(
    `/p/${slug}/quotes${qs ? `?${qs}` : ''}`,
  );
}

export async function updatePortalQuote(
  slug: string,
  quoteId: string,
  data: UpdateQuoteRequest,
): Promise<QuoteRequest> {
  return apiRequest<QuoteRequest>(`/p/${slug}/quotes/${quoteId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
