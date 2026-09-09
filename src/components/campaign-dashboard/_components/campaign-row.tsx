import Link from 'next/link';
import { CampaignRowProps } from './types';
import styles from '../styles.module.css';

export function CampaignRow({ campaign }: CampaignRowProps) {
  return (
    <tr>
      <td>
        <Link href={`/campaign/${campaign._id}`}>
          <strong>{campaign.name}</strong>
        </Link>
      </td>
      <td>{campaign.owner}</td>
      <td>
        ${campaign.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </td>
      <td>{formatDate(campaign.start)}</td>
      <td>
        {formatDate(campaign.end)}{' '}
        <span className={styles['campaign-dashboard-rowArrow']}>→</span>
      </td>
    </tr>
  );
}

function formatDate(value: string) {
  return value
    ? new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';
}
