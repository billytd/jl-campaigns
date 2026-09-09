'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TokenExpiryRedirectProps } from './types';

const REDIRECT_BEFORE_EXPIRY_MS = 5000;

export function TokenExpiryRedirect({ exp }: TokenExpiryRedirectProps) {
  const router = useRouter();
  useEffect(() => {
    const delay = Math.max(
      0,
      exp * 1000 - Date.now() - REDIRECT_BEFORE_EXPIRY_MS,
    );
    const timer = setTimeout(() => {
      router.push('/?tokenExpired=1');
    }, delay);
    return () => clearTimeout(timer);
  }, [exp, router]);
  return null;
}
