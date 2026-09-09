export type CampaignStatsRecord = {
  'campaign-id': string;
  totalViewCount: number;
  costPerView: number;
  hookRate: number;
  videoCompletionRate: number;
  viewThroughRate: number;
  clickThroughRate: number;
};

export type CampaignStats = {
  totalViewCount: number;
  costPerView: number | null;
  hookRate: number | null;
  videoCompletionRate: number | null;
  viewThroughRate: number | null;
  clickThroughRate: number | null;
};
