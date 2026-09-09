import { getAuthenticatedUser } from '@/lib/server';
import { CampaignDashboardClient } from './dashboard-client';

export function CampaignDashboard() {
  const userPromise = getAuthenticatedUser().catch(() => undefined);
  return <CampaignDashboardClient userPromise={userPromise} />;
}
