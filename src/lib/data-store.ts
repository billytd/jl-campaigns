import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { Profile } from './server.types';
import { Campaign } from './campaign.types';
import { CampaignStatsRecord } from './campaign-stats.types';

const DATA_STORE_DIR = path.join(process.cwd(), 'data-store');
const USERS_FILE = 'users.json';
const CAMPAIGNS_FILE = 'campaigns.json';
const CAMPAIGN_STATS_FILE = 'campaign-stats.json';

async function readCollection<T>(fileName: string): Promise<T[]> {
  const raw = await fs.readFile(path.join(DATA_STORE_DIR, fileName), 'utf-8');
  return JSON.parse(raw) as T[];
}

async function writeCollection<T>(
  fileName: string,
  records: T[],
): Promise<void> {
  await fs.writeFile(
    path.join(DATA_STORE_DIR, fileName),
    `${JSON.stringify(records, null, 2)}\n`,
    'utf-8',
  );
}

export function createId() {
  return randomUUID();
}

export function readUsers() {
  return readCollection<Profile>(USERS_FILE);
}

export function readCampaigns() {
  return readCollection<Campaign>(CAMPAIGNS_FILE);
}

export function writeCampaigns(campaigns: Campaign[]) {
  return writeCollection<Campaign>(CAMPAIGNS_FILE, campaigns);
}

export function readCampaignStats() {
  return readCollection<CampaignStatsRecord>(CAMPAIGN_STATS_FILE);
}
