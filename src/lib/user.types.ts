export type User = {
  email: string;
  name: string;
  role: 'normal' | 'admin';
  exp: number;
};

export type UserSession = User & {
  id: string;
};
