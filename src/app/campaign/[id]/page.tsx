import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { CampaignEditor } from '@/components/campaign-editor';
import { CampaignStats } from '@/components/campaign-stats';
import { CampaignStatsFallback } from '@/components/campaign-stats/campaign-stats-fallback';
import { getCampaign } from '@/lib/campaign-actions';
import { CampaignPageParams } from './page.types';
import styles from './page.module.css';

// This page reads the session cookie (via getCampaign -> getAuthenticatedUser)
// to authorize access to the campaign before deciding whether to redirect,
// which Cache Components can't prerender into a static shell. Opt out of
// instant-navigation validation and let it block on the server instead. See:
// https://nextjs.org/docs/app/guides/authentication-with-cache-components#migrating-an-existing-app
export const instant = false;

export default async function CampaignPage({
  params,
  searchParams,
}: CampaignPageParams) {
  const { campaign } = await loadCampaign(params);
  const created = (await searchParams)?.created === '1';
  return (
    <div className={styles['campaign-page-layout']}>
      <CampaignEditor
        initialFormData={campaign}
        initialMessage={created ? 'Campaign Created' : undefined}
      />
      <Suspense fallback={<CampaignStatsFallback />}>
        <CampaignStats campaignId={campaign._id} budget={campaign.budget} />
      </Suspense>
    </div>
  );
}

async function loadCampaign(params: Promise<{ id: string }>) {
  const id = (await params).id;
  const result = await getCampaign(id);
  if (!result.ok) {
    redirect(result.expired ? '/?tokenExpired=1' : '/?autherr=1');
  }
  const { owner: _owner, ownerId: _ownerId, ...campaign } = result.campaign;
  return { campaign };
}
