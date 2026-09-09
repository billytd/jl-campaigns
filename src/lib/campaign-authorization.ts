import { readCampaigns } from './data-store';
import { getAuthenticatedUser } from './server';

export async function getAuthorizedCampaign(id: string) {
  const user = await getAuthenticatedUser();
  const campaigns = await readCampaigns();
  const campaign = campaigns.find((item) => item._id === id);
  if (!campaign) throw new Error('CAMPAIGN_NOT_FOUND');
  if (user.role !== 'admin' && campaign.ownerId !== user.id)
    throw new Error('FORBIDDEN');
  return { user, campaign };
}
