'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { getCampaigns } from '@/lib/campaign-actions';
import { Campaign } from '@/lib/campaign.types';
import { CampaignDashboardClientProps } from './types';
import styles from './styles.module.css';
import { CampaignTable } from './_components/campaign-table';
import { CampaignTableFallback } from './_components/campaign-table-fallback';
import { OwnerFilter } from './_components/owner-filter';

export function CampaignDashboardClient({
  userPromise,
}: CampaignDashboardClientProps) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All campaigns');
  useEffect(() => {
    let hasRun = false;
    getCampaigns().then((result) => {
      if (hasRun) return;
      if (!result.ok) {
        if (result.unauthorized)
          router.push(result.expired ? '/?tokenExpired=1' : '/?autherr=1');
        setError(result.message);
        return;
      }
      setCampaigns(result.campaigns);
    });
    return () => {
      hasRun = true;
    };
  }, [router]);
  const owners = [...new Set((campaigns || []).map((item) => item.owner))];
  const rows = useMemo(
    () =>
      (campaigns || []).filter(
        (item) => filter === 'All campaigns' || item.owner === filter,
      ),
    [campaigns, filter],
  );
  return (
    <section className={styles['campaign-dashboard-dashboard']}>
      <div className={styles['campaign-dashboard-pageTitle']}>
        <div>
          <p className={styles['campaign-dashboard-eyebrow']}>
            OVERVIEW / {campaigns?.length.toString().padStart(2, '0') || '00'}{' '}
            CAMPAIGNS
          </p>
          <h1>Campaign dashboard</h1>
          <p className={styles['campaign-dashboard-muted']}>
            A live view of your advertising programs and their delivery windows.
          </p>
        </div>
        <Link
          className={styles['campaign-dashboard-primary']}
          href="/campaign/new"
        >
          ＋ Create Campaign
        </Link>
      </div>
      {error && <p className={styles['campaign-dashboard-error']}>{error}</p>}
      <div className={styles['campaign-dashboard-toolbar']}>
        <span>
          <strong>{rows.length}</strong> campaigns
        </span>
        <Suspense fallback={null}>
          <OwnerFilter
            userPromise={userPromise}
            owners={owners}
            value={filter}
            onChange={setFilter}
          />
        </Suspense>
      </div>
      <Suspense fallback={<CampaignTableFallback />}>
        {campaigns ? (
          <CampaignTable campaigns={rows} />
        ) : (
          <CampaignTableFallback />
        )}
      </Suspense>
    </section>
  );
}
