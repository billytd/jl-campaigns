export type Profile = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'normal' | 'admin';
};
