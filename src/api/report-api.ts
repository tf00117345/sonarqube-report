import type { ReportConfig, ReportData } from '../types/models';

export async function fetchReportData(config: ReportConfig): Promise<ReportData> {
  const resp = await fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: config.url,
      token: config.token,
      projectKey: config.projectKey,
      organization: config.organization || undefined,
      password: config.password || undefined,
    }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({ error: resp.statusText }));
    throw new Error(body.error || `HTTP ${resp.status}`);
  }

  return resp.json();
}
