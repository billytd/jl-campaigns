'use server';

import { getAuthorizedCampaign } from '@/lib/campaign-authorization';
import { Campaign, CampaignFormData } from '@/lib/campaign.types';
import { getCampaignStats } from '@/lib/campaign-stats';
import { CampaignStats } from '@/lib/campaign-stats.types';
import { createId, readCampaigns, writeCampaigns } from '@/lib/data-store';
import {
  getAuthenticatedUser,
  isAuthorizationError,
  isTokenExpiredError,
  validateCampaign,
} from '@/lib/server';

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type CampaignsResult =
  | { ok: true; campaigns: Campaign[] }
  | { ok: false; message: string; unauthorized: boolean; expired: boolean };

export async function getCampaigns(): Promise<CampaignsResult> {
  try {
    const user = await getAuthenticatedUser();
    const campaigns = await readCampaigns();

    await timeout(4000); // Simulate a delay of 4 seconds

    return {
      ok: true,
      campaigns:
        user.role === 'admin'
          ? campaigns
          : campaigns.filter((campaign) => campaign.ownerId === user.id),
    };
  } catch (error) {
    return {
      ok: false,
      message: isAuthorizationError(error)
        ? 'Authorization error. Please Sign In.'
        : 'An error occurred.',
      unauthorized: isAuthorizationError(error),
      expired: isTokenExpiredError(error),
    };
  }
}

export type CampaignResult =
  { ok: true; campaign: Campaign } | { ok: false; expired: boolean };

export async function getCampaign(id: string): Promise<CampaignResult> {
  try {
    const { campaign } = await getAuthorizedCampaign(id);
    return { ok: true, campaign };
  } catch (error) {
    return { ok: false, expired: isTokenExpiredError(error) };
  }
}

export type SaveCampaignResult =
  { ok: true; campaign: Campaign } | { ok: false; message: string };

export async function createCampaign(
  data: CampaignFormData,
): Promise<SaveCampaignResult> {
  try {
    const user = await getAuthenticatedUser();
    if (!validateCampaign(data))
      return { ok: false, message: 'Invalid campaign data.' };
    const campaigns = await readCampaigns();
    const campaign: Campaign = {
      ...data,
      _id: createId(),
      ownerId: user.id,
      owner: user.name,
    };
    campaigns.push(campaign);
    await writeCampaigns(campaigns);
    return { ok: true, campaign };
  } catch (error) {
    return {
      ok: false,
      message: isAuthorizationError(error)
        ? 'Authorization error. Please Sign In.'
        : 'An error occurred.',
    };
  }
}

export async function updateCampaign(
  id: string,
  data: CampaignFormData,
): Promise<SaveCampaignResult> {
  try {
    const { user } = await getAuthorizedCampaign(id);
    if (!validateCampaign(data))
      return { ok: false, message: 'Invalid campaign data.' };
    const campaigns = await readCampaigns();
    const index = campaigns.findIndex((item) => item._id === id);
    if (index === -1) throw new Error('CAMPAIGN_NOT_FOUND');
    const campaign: Campaign = {
      ...data,
      _id: id,
      ownerId: user.id,
      owner: user.name,
    };
    campaigns[index] = campaign;
    await writeCampaigns(campaigns);
    return { ok: true, campaign };
  } catch (error) {
    const auth =
      isAuthorizationError(error) ||
      (error instanceof Error && error.message === 'FORBIDDEN');
    return {
      ok: false,
      message: auth
        ? 'Authorization error. Please Sign In.'
        : 'An error occurred.',
    };
  }
}

export type CampaignStatsResult =
  { ok: true; stats: CampaignStats } | { ok: false };

export async function getCampaignStatsAction(
  id: string,
): Promise<CampaignStatsResult> {
  try {
    await getAuthorizedCampaign(id);
    return { ok: true, stats: await getCampaignStats(id) };
  } catch {
    return { ok: false };
  }
}
