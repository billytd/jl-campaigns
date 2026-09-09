import { UserSession } from '@/lib/user.types';

export type SiteShellProps = {
  children: React.ReactNode;
  user?: Promise<UserSession>;
};
