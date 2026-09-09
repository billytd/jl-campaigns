import { CampaignFormData } from './campaign.types';

export const blankCampaign: CampaignFormData = {
  name: '',
  budget: 0,
  start: '',
  end: '',
  age: ['20-29'],
  gender: ['Female'],
  country: 'United States',
  state: 'California',
  city: '',
  zip: '',
  publishers: [],
  devices: [],
};
