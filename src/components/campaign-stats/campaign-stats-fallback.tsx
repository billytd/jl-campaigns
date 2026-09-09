import styles from './styles.module.css';

const placeholders = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
];

export function CampaignStatsFallback() {
  return (
    <aside className={styles['campaign-stats-panel']} aria-hidden="true">
      <h2 className={styles['campaign-stats-subheader']}>Campaign Stats</h2>
      <div className={styles['campaign-stats-list']}>
        {placeholders.map((placeholder) => (
          <div className={styles['campaign-stats-row']} key={placeholder}>
            <span className={styles['campaign-stats-skeletonLabel']} />
            <span className={styles['campaign-stats-skeletonValue']} />
          </div>
        ))}
      </div>
    </aside>
  );
}
