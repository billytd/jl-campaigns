import { cacheLife } from 'next/cache';
import { readCampaignStats } from './data-store';
import { CampaignStats } from './campaign-stats.types';

export const emptyCampaignStats: CampaignStats = {
  totalViewCount: 0,
  costPerView: null,
  hookRate: null,
  videoCompletionRate: null,
  viewThroughRate: null,
  clickThroughRate: null,
};

export async function getCampaignStats(
  campaignId: string,
): Promise<CampaignStats> {
  'use cache';
  cacheLife({ stale: 900 }); // 15 minutes
  // This function only reads the data store by campaignId — no cookies()
  // or other dynamic APIs — so it's safe to cache. Authorization stays
  // in the caller (getCampaignStatsAction), which reads cookies() and
  // must run uncached on every request.
  const records = await readCampaignStats();
  const record = records.find((item) => item['campaign-id'] === campaignId);
  if (!record) return emptyCampaignStats;
  return {
    totalViewCount: record.totalViewCount,
    costPerView: record.costPerView,
    hookRate: record.hookRate,
    videoCompletionRate: record.videoCompletionRate,
    viewThroughRate: record.viewThroughRate,
    clickThroughRate: record.clickThroughRate,
  };
}
