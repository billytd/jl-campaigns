/* eslint-disable no-console */
import { cookies } from 'next/headers';
import { errors as joseErrors, jwtVerify, SignJWT } from 'jose';
import { readUsers } from './data-store';
import { Profile } from './server.types';
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { ACCESS_TOKEN_COOKIE } from './constants';
import { UserSession } from './user.types';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'development-only-jamloop-secret',
);

export function profileCacheTag(id: string) {
  return `profile-${id}`;
}

export async function createAccessToken(profile: Profile) {
  return new SignJWT({
    _id: profile._id,
    role: profile.role,
    name: profile.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret);
}

async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  if (
    typeof payload._id !== 'string' ||
    (payload.role !== 'normal' && payload.role !== 'admin') ||
    typeof payload.exp !== 'number'
  ) {
    throw new Error('AUTHORIZATION_ERROR');
  }
  return { id: payload._id, exp: payload.exp };
}

async function readProfile(id: string) {
  const users = await readUsers();
  return users.find((user) => user._id === id);
}

async function getProfile(id: string) {
  'use cache';
  cacheLife({ stale: 300 }); // 5 minutes
  cacheTag(profileCacheTag(id));

  const profile = await readProfile(id);
  return profile;
}

export async function getAuthenticatedUser() {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    throw new Error('AUTHORIZATION_ERROR');
  }
  try {
    const { id, exp } = await verifyAccessToken(token);
    let profile = await getProfile(id);
    if (profile && profile._id !== id) {
      revalidateTag(profileCacheTag(id), { expire: 0 });
      profile = await readProfile(id);
    }
    if (!profile) {
      throw new Error('AUTHORIZATION_ERROR');
    }
    return {
      id: profile._id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      exp,
    } as UserSession;
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      throw new Error('TOKEN_EXPIRED_ERROR');
    }
    throw new Error('AUTHORIZATION_ERROR');
  }
}

export function isAuthorizationError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message === 'AUTHORIZATION_ERROR' ||
      error.message === 'TOKEN_EXPIRED_ERROR')
  );
}

export function isTokenExpiredError(error: unknown) {
  return error instanceof Error && error.message === 'TOKEN_EXPIRED_ERROR';
}

export function validateCampaign(value: unknown) {
  if (!value || typeof value !== 'object') return false;
  const campaign = value as Record<string, unknown>;
  const stringValue = (field: unknown) =>
    typeof field === 'string' ? field.trim() : '';
  const name = stringValue(campaign.name);
  const city = stringValue(campaign.city);
  const zip = stringValue(campaign.zip);
  const state = stringValue(campaign.state);
  const start = stringValue(campaign.start);
  const end = stringValue(campaign.end);
  const budget = Number(campaign.budget);
  const publishers = Array.isArray(campaign.publishers)
    ? campaign.publishers
    : [];
  const devices = Array.isArray(campaign.devices) ? campaign.devices : [];
  const today = new Date().toISOString().slice(0, 10);

  return (
    /^[A-Za-z0-9 .,!?'-]{2,50}$/.test(name) &&
    budget >= 50 &&
    budget <= 100000 &&
    Number.isFinite(budget) &&
    start >= today &&
    end > start &&
    (state.length === 0 || /^[A-Za-zÀ-ÿ -]{2,50}$/.test(state)) &&
    (city.length === 0 || /^[A-Za-z0-9 -]{2,10}$/.test(city)) &&
    (zip.length === 0 || (zip.length >= 2 && zip.length <= 10)) &&
    publishers.length > 0 &&
    devices.length > 0
  );
}
