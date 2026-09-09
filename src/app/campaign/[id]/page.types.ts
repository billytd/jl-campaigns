export type CampaignPageParams = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};
