import { use } from 'react';
import { OwnerFilterProps } from './types';
import styles from '../styles.module.css';

export function OwnerFilter({
  userPromise,
  owners,
  value,
  onChange,
}: OwnerFilterProps) {
  const user = use(userPromise);
  if (!user || user.role !== 'admin') return null;
  return (
    <label className={styles['campaign-dashboard-filter']}>
      Filter by owner{' '}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option>All campaigns</option>
        {owners.map((owner) => (
          <option key={owner}>{owner}</option>
        ))}
      </select>
    </label>
  );
}
