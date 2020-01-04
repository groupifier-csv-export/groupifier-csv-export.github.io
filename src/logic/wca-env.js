const searchParams = new URLSearchParams(window.location.search);
export const PRODUCTION =
  process.env.NODE_ENV === 'production' && !searchParams.has('staging');

export const WCA_ORIGIN = PRODUCTION
  ? 'https://www.worldcubeassociation.org'
  : 'https://staging.worldcubeassociation.org';

export const WCA_OAUTH_CLIENT_ID = PRODUCTION
  ? 'eE1SyRia-Z6HTVr3TVEzOksUekySwGO81mKSWrRypNA'
  : 'example-application-id';
