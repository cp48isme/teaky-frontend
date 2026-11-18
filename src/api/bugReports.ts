import { apiRequest } from './client';

/** Report a bug (t02, 18 Nov 2026): the record on the server, one email to
 * the operator; never a mailto. */
export interface BugReportCreate {
  page_url: string;
  description: string;
  screenshot_url?: string | null;
}

export interface BugReport {
  id: string;
  created_at: string;
  notified: boolean;
}

export async function reportBug(body: BugReportCreate): Promise<BugReport> {
  return apiRequest<BugReport>('/bug-reports', { method: 'POST', body: JSON.stringify(body) });
}
