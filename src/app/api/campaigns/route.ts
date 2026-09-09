/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { createId, readCampaigns, writeCampaigns } from '@/lib/data-store';
import {
  getAuthenticatedUser,
  isAuthorizationError,
  isTokenExpiredError,
  validateCampaign,
} from '@/lib/server';

import { Campaign } from '@/lib/campaign.types';

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    const campaigns = await readCampaigns();

    await timeout(3000); // Simulate a delay of 3 seconds
    return NextResponse.json(
      user.role === 'admin'
        ? campaigns
        : campaigns.filter((campaign) => campaign.ownerId === user.id),
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: isAuthorizationError(error)
          ? 'Authorization error. Please Sign In.'
          : 'An error occurred.',
        expired: isTokenExpiredError(error),
      },
      { status: isAuthorizationError(error) ? 401 : 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    if (!validateCampaign(body))
      return NextResponse.json(
        { message: 'Invalid campaign data.' },
        { status: 400 },
      );
    const campaigns = await readCampaigns<Campaign>();
    const campaign: Campaign = {
      ...body,
      _id: createId(),
      ownerId: user.id,
      owner: user.name,
    };
    campaigns.push(campaign);
    await writeCampaigns(campaigns);

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: isAuthorizationError(error)
          ? 'Authorization error. Please Sign In.'
          : 'An error occurred.',
      },
      { status: isAuthorizationError(error) ? 401 : 500 },
    );
  }
}
