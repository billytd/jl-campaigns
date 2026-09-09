'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitEventHandler, useState } from 'react';
import { blankCampaign } from '@/lib/campaign';
import { createCampaign, updateCampaign } from '@/lib/campaign-actions';
import { Campaign, CampaignFormData } from '@/lib/campaign.types';
import styles from './styles.module.css';

const publishers = [
  'Hulu',
  'Discovery',
  'ABC',
  'A&E',
  'TLC',
  'Fox News',
  'Fox Sports',
];
const devices = ['CTV', 'Mobile Device', 'Web Browser'];
const ageRanges = [
  '0-5',
  '6-9',
  '10-14',
  '15-19',
  '20-29',
  '30-39',
  '40-64',
  '65+',
];
const genders = ['Male', 'Female', 'Other / Non-Binary'];
const usStatesAndTerritories = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'American Samoa',
  'District of Columbia',
  'Guam',
  'Northern Mariana Islands',
  'Puerto Rico',
  'U.S. Minor Outlying Islands',
  'United States Virgin Islands',
];

export function CampaignEditor({
  initialFormData = blankCampaign,
  initialMessage = '',
}: {
  initialFormData?: CampaignFormData;
  initialMessage?: string;
}) {
  const router = useRouter();
  const campaignId = initialFormData._id ?? undefined;
  const [form, setForm] = useState(() =>
    initialFormData.country === 'United States'
      ? initialFormData
      : { ...initialFormData, state: '' },
  );
  const [message, setMessage] = useState(initialMessage);
  const name = form.name.trim();
  const start = form.start.trim();
  const end = form.end.trim();
  const city = form.city.trim();
  const zip = form.zip.trim();
  const state = form.state.trim();
  const update = (key: keyof Campaign, value: Campaign[keyof Campaign]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const valid =
    name.length >= 2 &&
    name.length <= 50 &&
    form.budget >= 50 &&
    form.budget <= 100000 &&
    start >= new Date().toISOString().slice(0, 10) &&
    end > start &&
    (city.length === 0 || (city.length >= 2 && city.length <= 50)) &&
    (zip.length === 0 || (zip.length >= 2 && zip.length <= 10)) &&
    (state.length === 0 || (state.length >= 2 && state.length <= 50)) &&
    form.publishers.length > 0 &&
    form.devices.length > 0;

  const toggleCheckbox = (
    key: 'age' | 'gender' | 'publishers' | 'devices',
    value: string,
  ) =>
    update(
      key,
      form[key].includes(value)
        ? form[key].filter((item) => item !== value)
        : [...form[key], value],
    );
  const selectCountry = (country: string) => {
    if (country === 'United States')
      setForm((current) => ({ ...current, country, state: '' }));
  };
  const submit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!valid) return;
    const result = campaignId
      ? await updateCampaign(campaignId, form)
      : await createCampaign(form);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    if (campaignId) {
      setMessage('Campaign Updated');
      return;
    } else {
      router.replace(`/campaign/${result.campaign._id}?created=1`);
    }
  };
  return (
    <section className={styles['campaign-editor-editor']}>
      <div className={styles['campaign-editor-editorHead']}>
        <Link className={styles['campaign-editor-back']} href="/dashboard">
          ← <span>Campaign Dashboard</span>
        </Link>
        <div>
          <p className={styles['campaign-editor-eyebrow']}>
            {campaignId ? 'CAMPAIGN / EDIT' : 'CAMPAIGN / NEW'}
          </p>
          <h1>{campaignId ? 'Edit Campaign' : 'Create Campaign'}</h1>
        </div>
        <div />
      </div>
      {message && (
        <p className={styles['campaign-editor-successBanner']}>✓ {message}</p>
      )}
      <form onSubmit={submit}>
        <div className={styles['campaign-editor-formGrid']}>
          <fieldset>
            <legend>Campaign details</legend>
            <label>
              Campaign Name
              <input
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
              />
            </label>
            <label>
              Budget Goal{' '}
              <span className={styles['campaign-editor-fieldHint']}>USD</span>
              <input
                type="number"
                min="50"
                max="100000"
                step="0.01"
                value={form.budget || ''}
                onChange={(event) =>
                  update('budget', Number(event.target.value))
                }
              />
            </label>
            <div className={styles['campaign-editor-twoCol']}>
              <label>
                Start Date
                <input
                  type="date"
                  value={form.start}
                  onChange={(event) => update('start', event.target.value)}
                />
              </label>
              <label>
                End Date
                <input
                  type="date"
                  value={form.end}
                  onChange={(event) => update('end', event.target.value)}
                />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Target demographic</legend>
            <div className={styles['campaign-editor-twoCol']}>
              <div>
                <p className={styles['campaign-editor-fieldLabel']}>Age</p>
                <div className={styles['campaign-editor-checkGrid']}>
                  {ageRanges.map((item) => (
                    <label
                      className={styles['campaign-editor-check']}
                      key={item}
                    >
                      <input
                        type="checkbox"
                        checked={form.age.includes(item)}
                        onChange={() => toggleCheckbox('age', item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className={styles['campaign-editor-fieldLabel']}>Gender</p>
                <div className={styles['campaign-editor-checkGrid']}>
                  {genders.map((item) => (
                    <label
                      className={styles['campaign-editor-check']}
                      key={item}
                    >
                      <input
                        type="checkbox"
                        checked={form.gender.includes(item)}
                        onChange={() => toggleCheckbox('gender', item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Target geo</legend>
            <div className={styles['campaign-editor-twoCol']}>
              <label>
                Country
                <select
                  value={form.country}
                  onChange={(event) => selectCountry(event.target.value)}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </label>
              <label>
                State / Province
                {form.country === 'United States' ? (
                  <select
                    value={form.state}
                    onChange={(event) => update('state', event.target.value)}
                  >
                    <option value="">Select a state or territory</option>
                    {usStatesAndTerritories.map((stateName) => (
                      <option key={stateName}>{stateName}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={form.state}
                    onChange={(event) => update('state', event.target.value)}
                  />
                )}
              </label>
            </div>
            <div className={styles['campaign-editor-twoCol']}>
              <label>
                City
                <input
                  value={form.city}
                  onChange={(event) => update('city', event.target.value)}
                />
              </label>
              <label>
                Zip Code
                <input
                  value={form.zip}
                  onChange={(event) => update('zip', event.target.value)}
                />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Inventory / Publishers</legend>
            <div className={styles['campaign-editor-checkGrid']}>
              {publishers.map((item) => (
                <label className={styles['campaign-editor-check']} key={item}>
                  <input
                    type="checkbox"
                    checked={form.publishers.includes(item)}
                    onChange={() => toggleCheckbox('publishers', item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Screens / Devices</legend>
            <div className={styles['campaign-editor-checkGrid']}>
              {devices.map((item) => (
                <label className={styles['campaign-editor-check']} key={item}>
                  <input
                    type="checkbox"
                    checked={form.devices.includes(item)}
                    onChange={() => toggleCheckbox('devices', item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className={styles['campaign-editor-submitBar']}>
          <p>
            {valid
              ? 'All required fields are complete'
              : 'Complete all required fields to continue'}
          </p>
          <button
            className={styles['campaign-editor-primary']}
            disabled={!valid}
            type="submit"
          >
            {campaignId ? 'Update Campaign' : 'Create Campaign'} <span>→</span>
          </button>
        </div>
      </form>
    </section>
  );
}
