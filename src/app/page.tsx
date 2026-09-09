import { LoginForm } from '@/components/login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    autherr?: string;
    logout?: string;
    tokenExpired?: string;
  }>;
}) {
  return <LoginForm searchParamsPromise={searchParams} />;
}
