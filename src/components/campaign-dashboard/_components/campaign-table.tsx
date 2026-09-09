'use client';

import { useMemo, useState } from 'react';
import { Campaign } from '@/lib/campaign.types';
import { CampaignRow } from './campaign-row';
import { CampaignSort, CampaignTableProps } from './types';
import styles from '../styles.module.css';

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const [sort, setSort] = useState<CampaignSort>({ key: 'name', direction: 1 });
  const rows = useMemo(
    () =>
      campaigns.toSorted(
        (a, b) =>
          String(a[sort.key]).localeCompare(String(b[sort.key])) *
          sort.direction,
      ),
    [campaigns, sort],
  );
  const sortBy = (key: keyof Campaign) =>
    setSort((current) =>
      current.key === key
        ? { key: 'name', direction: current.direction === 1 ? -1 : 1 }
        : { key, direction: 1 },
    );
  return (
    <div className={styles['campaign-dashboard-tableWrap']}>
      <table>
        <thead>
          <tr>
            {[
              ['name', 'Campaign Name'],
              ['owner', 'Owner'],
              ['budget', 'Budget Goal'],
              ['start', 'Start Date'],
              ['end', 'End Date'],
            ].map(([key, label]) => (
              <th key={key}>
                <button onClick={() => sortBy(key as keyof Campaign)}>
                  {label}{' '}
                  <span>
                    {sort.key === key
                      ? sort.direction === 1
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((campaign) => (
            <CampaignRow key={campaign._id} campaign={campaign} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
