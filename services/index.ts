// Export the SDK with automatic token refresh middleware
export { default } from './sdkMiddleware';

// Also export the raw SDK for special cases
export { rawVitalFitApi } from './vitalfitSdk';
