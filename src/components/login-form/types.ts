export type LoginFormProps = {
  notice?: string;
  searchParamsPromise: Promise<{
    autherr?: string;
    logout?: string;
    tokenExpired?: string;
  }>;
};
