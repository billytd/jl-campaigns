/* eslint-disable no-console */
'use client';

import { SubmitEventHandler, useEffect, useState } from 'react';
import { login } from '@/lib/auth-actions';
import { LoginFormProps } from './types';
import styles from './styles.module.css';

export function LoginForm({ searchParamsPromise }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const resolveParams = async () => {
      const params = await searchParamsPromise;
      const notice =
        params.tokenExpired === '1'
          ? 'Session expired. Please sign in again.'
          : params.autherr === '1'
            ? 'Authorization error. Please Sign In.'
            : params.logout === '1'
              ? 'You have been signed out.'
              : undefined;
      setError(notice || '');
    };
    resolveParams();
  }, [searchParamsPromise]);

  const submit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result?.message) setError(result.message);
  };
  return (
    <section className={styles['login-form-login']}>
      <div className={styles['login-form-loginIntro']}>
        <p className={styles['login-form-eyebrow']}>JAMLOOP / WORKSPACE</p>
        <h1>
          Make every impression <i>count.</i>
        </h1>
        <p>
          Plan, launch, and tune your advertising campaigns from one clear view.
        </p>
      </div>
      <form className={styles['login-form-loginCard']} onSubmit={submit}>
        <div>
          <p className={styles['login-form-eyebrow']}>WELCOME BACK</p>
          <h2>Sign in to your workspace</h2>
        </div>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p className={styles['login-form-error']}>{error}</p>}
        <button className={styles['login-form-primary']} type="submit">
          Sign In <span>→</span>
        </button>
      </form>
    </section>
  );
}
