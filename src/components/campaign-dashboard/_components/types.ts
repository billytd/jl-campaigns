import { Campaign } from '@/lib/campaign.types';
import { UserSession } from '@/lib/user.types';

export type CampaignTableProps = {
  campaigns: Campaign[];
};

export type CampaignSort = {
  key: keyof Campaign;
  direction: number;
};

export type CampaignRowProps = {
  campaign: Campaign;
};

export type OwnerFilterProps = {
  userPromise: Promise<UserSession | undefined>;
  owners: string[];
  value: string;
  onChange: (value: string) => void;
};
