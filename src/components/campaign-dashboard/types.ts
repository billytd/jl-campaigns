import { UserSession } from '@/lib/user.types';

export type CampaignDashboardClientProps = {
  userPromise: Promise<UserSession | undefined>;
};
