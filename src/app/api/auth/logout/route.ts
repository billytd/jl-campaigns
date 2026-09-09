import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { decodeJwt } from 'jose';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '@/lib/constants';
import { profileCacheTag } from '@/lib/server';

export async function POST(request: Request) {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (token) {
    try {
      const { _id } = decodeJwt<{ _id?: string }>(token);
      if (_id) revalidateTag(profileCacheTag(_id), { expire: 0 });
    } catch {
      // Malformed token: nothing to invalidate.
    }
  }
  const response = NextResponse.redirect(
    new URL('/?logout=1', request.url),
    303,
  );
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
