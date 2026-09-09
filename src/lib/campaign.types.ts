export type Campaign = {
  _id: string;
  name: string;
  budget: number;
  start: string;
  end: string;
  owner: string;
  age: string[];
  gender: string[];
  country: string;
  state: string;
  city: string;
  zip: string;
  publishers: string[];
  devices: string[];
  ownerId: string;
};

export type CampaignFormData = Omit<Campaign, '_id' | 'owner' | 'ownerId'> & {
  _id?: string;
};
