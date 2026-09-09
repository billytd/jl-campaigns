'use server';

import argon2 from 'argon2';
import { cookies } from 'next/headers';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { readUsers } from '@/lib/data-store';
import { createAccessToken, profileCacheTag } from '@/lib/server';
import { ACCESS_TOKEN_COOKIE } from './constants';

export type LoginResult = { message: string };

export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  try {
    const users = await readUsers();
    const profile = users.find((user) => user.email === email);

    if (!profile || !(await argon2.verify(profile.password, password)))
      return { message: 'Invalid Credentials' };

    updateTag(profileCacheTag(profile._id));
    const token = await createAccessToken(profile);
    (await cookies()).set(ACCESS_TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1800,
      path: '/',
    });
  } catch {
    return { message: 'An error occurred.' };
  }
  redirect('/dashboard');
}
