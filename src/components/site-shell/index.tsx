import Link from 'next/link';
import { TokenExpiryRedirect } from '@/components/token-expiry-redirect';
import { SiteShellProps } from './types';
import styles from './styles.module.css';
import { Suspense } from 'react';
import { UserSession } from '@/lib/user.types';
import { getAuthenticatedUser } from '@/lib/server';

const currentYear = new Date().getFullYear();

export async function SiteShell({ children }: SiteShellProps) {
  const userPromise = getAuthenticatedUser().catch(() => undefined);

  return (
    <div className={styles['site-shell-page']}>
      <Suspense fallback={<HeaderLoggedOut />}>
        <HeaderLoggedIn userPromise={userPromise} />
      </Suspense>

      <main className={styles['site-shell-main']}>{children}</main>

      <footer>
        ©Copyright JamLoop <span>{currentYear}</span>
      </footer>
    </div>
  );
}

async function HeaderLoggedIn({
  userPromise,
}: {
  userPromise: Promise<UserSession | undefined>;
}) {
  const user = await userPromise;
  return (
    <header className={styles['site-shell-header']}>
      {user && <TokenExpiryRedirect exp={user.exp} />}
      <Link
        className={styles['site-shell-brand']}
        href={user ? '/dashboard' : '/'}
      >
        <span className={styles['site-shell-brandMark']}>J</span>
        <span>
          JamLoop <b>Campaign Manager</b>
        </span>
      </Link>
      {user && (
        <div className={styles['site-shell-account']}>
          <span>
            {user.name} {user.role === 'admin' && <small>(admin)</small>}
          </span>
          <form action="/api/auth/logout" method="post">
            <button>Sign Out</button>
          </form>
        </div>
      )}
    </header>
  );
}

function HeaderLoggedOut() {
  return (
    <header>
      <Link className={styles['site-shell-brand']} href={'/'}>
        {' '}
        <span className={styles['site-shell-brandMark']}>J</span>
        <span>
          JamLoop <b>Campaign Manager</b>
        </span>
      </Link>
    </header>
  );
}
