import { getCampaignStatsAction } from '@/lib/campaign-actions';
import { emptyCampaignStats } from '@/lib/campaign-stats';
import { CampaignStatsProps } from './types';
import styles from './styles.module.css';

type MetricFormat = 'count' | 'currency' | 'percent';

function formatMetric(format: MetricFormat, value: number | null): string {
  if (value === null) return 'n/a';
  if (format === 'count') return value.toLocaleString('en-US');
  if (format === 'currency')
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  return `${(value * 100).toFixed(1)}%`;
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function CampaignStats({
  campaignId,
  budget,
}: CampaignStatsProps) {
  await timeout(4000); // Simulate a delay of 4 seconds
  const result = await getCampaignStatsAction(campaignId);
  const stats = result.ok ? result.stats : emptyCampaignStats;
  const budgetSpent =
    stats.costPerView === null
      ? null
      : stats.totalViewCount * stats.costPerView;
  const budgetRemaining = budgetSpent === null ? null : budget - budgetSpent;

  const metrics: {
    label: string;
    format: MetricFormat;
    value: number | null;
  }[] = [
    { label: 'Total View Count', format: 'count', value: stats.totalViewCount },
    { label: 'Cost Per View', format: 'currency', value: stats.costPerView },
    { label: 'Budget Spent', format: 'currency', value: budgetSpent },
    { label: 'Budget Remaining', format: 'currency', value: budgetRemaining },
    { label: 'Hook Rate', format: 'percent', value: stats.hookRate },
    {
      label: 'Video Completion Rate',
      format: 'percent',
      value: stats.videoCompletionRate,
    },
    {
      label: 'View-Through Rate',
      format: 'percent',
      value: stats.viewThroughRate,
    },
    {
      label: 'Click-Through Rate',
      format: 'percent',
      value: stats.clickThroughRate,
    },
  ];

  return (
    <aside className={styles['campaign-stats-panel']}>
      <h2 className={styles['campaign-stats-subheader']}>Campaign Stats</h2>
      <dl className={styles['campaign-stats-list']}>
        {metrics.map(({ label, format, value }) => (
          <div className={styles['campaign-stats-row']} key={label}>
            <dt>{label}</dt>
            <dd>{formatMetric(format, value)}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
