import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AICreatedResultsStep from '../AICreatedResultsStep';

/** Independent review, 19 Nov 2026, finding 4: the mockup-error fallback
 * wrote the AI-produced category into innerHTML. It is rendered text now:
 * a category carrying markup shows as its characters and runs nothing. */

const category = '<img src=x onerror="window.__xss=1">Hats';
vi.mock('../../../api/products', () => ({
  listProducts: vi.fn(() =>
    Promise.resolve([
      { id: 'p1', name: 'Cap', category, mockup_urls: ['https://cdn.example/missing.png'], base_price: 1, status: 'draft' },
    ]),
  ),
}));

describe('AICreatedResultsStep mockup fallback', () => {
  it('renders the category as text when the mockup fails, never as HTML', async () => {
    render(
      <MemoryRouter>
        <AICreatedResultsStep result={{ portal_id: 'por-1', portal_url: '/p/p', portal_name: 'P', products_created: 1, categories_created: ['Hats'], brand_assets_found: { colors: [], logo: null } as never, capability_gaps: [], playbook_applied: null, warnings: [], agent_summary: '' }} onCreateNew={() => undefined} />
      </MemoryRouter>,
    );
    const img = await screen.findByAltText('Cap');
    fireEvent.error(img);
    await waitFor(() => expect(screen.queryByAltText('Cap')).toBeNull());
    expect(screen.getAllByText(category).length).toBeGreaterThan(0);
    expect(document.querySelector('img[src="x"]')).toBeNull();
    expect((window as unknown as { __xss?: number }).__xss).toBeUndefined();
  });
});
