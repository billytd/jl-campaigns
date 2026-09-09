import styles from '../styles.module.css';

const placeholders = ['one', 'two', 'three', 'four'];

export function CampaignTableFallback() {
  return (
    <div className={styles['campaign-dashboard-tableWrap']} aria-hidden="true">
      <table className={styles['campaign-dashboard-skeletonTable']}>
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Owner</th>
            <th>Budget Goal</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {placeholders.map((placeholder) => (
            <tr key={placeholder}>
              <td>
                <span className={styles['campaign-dashboard-skeletonLine']} />
                <span className={styles['campaign-dashboard-skeletonShort']} />
              </td>
              <td>
                <span className={styles['campaign-dashboard-skeletonLine']} />
              </td>
              <td>
                <span className={styles['campaign-dashboard-skeletonLine']} />
              </td>
              <td>
                <span className={styles['campaign-dashboard-skeletonLine']} />
              </td>
              <td>
                <span className={styles['campaign-dashboard-skeletonLine']} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
