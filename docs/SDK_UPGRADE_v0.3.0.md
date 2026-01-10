# SDK Upgrade to v0.3.0 - Automatic Token Refresh

## Summary

Updated the VitalFit SDK from v0.2.0 to v0.3.0, which includes built-in automatic token refresh functionality. This eliminates the need for custom Proxy middleware and simplifies the codebase.

## What Changed

### 1. SDK Version Update
- **Before**: `@vitalfit/sdk@0.2.0`
- **After**: `@vitalfit/sdk@0.3.0`

### 2. New SDK Features in v0.3.0

The SDK now includes built-in token refresh capabilities:

```typescript
// Client class now has these methods:
client.setCallbacks(onTokenUpdate, onLogout)  // Set callbacks for token updates
client.setTokens(access, refresh)             // Set both tokens at once
client.removeTokens()                         // Clear tokens

// AuthService now has:
auth.renewToken(refresh_token)                // Refresh the access token
auth.saveTokens(access, refresh)              // Save both tokens

// LoginResponse now includes:
{
  token: string,
  refresh_token: string
}
```

### 3. Architecture Changes

#### Before (v0.2.0 with Custom Middleware)
```
App → sdkMiddleware (Proxy) → vitalfitSdk → API
```

#### After (v0.3.0 with Built-in Refresh)
```
App → vitalfitSdk (with callbacks) → API
```

### 4. Files Modified

#### `contexts/AuthContext.tsx`
- Removed custom `refresh()` method
- Added `client.setCallbacks()` to handle automatic token refresh
- Simplified login flow to use `client.setTokens()`
- Token refresh is now handled automatically by the SDK

#### `services/index.ts`
- Simplified to export the SDK directly
- Removed middleware wrapper

#### `services/vitalfitSdk.ts`
- Removed `rawVitalFitApi` export (no longer needed)

#### `app/(auth)/login.tsx`
- Updated to use typed `refresh_token` from response
- Removed type assertion `(response as { refresh_token?: string })`

#### `app/(auth)/confirm-email.tsx`
- Updated to use typed `refresh_token` from response
- Added validation for both tokens

### 5. Files No Longer Needed

The following files are now obsolete but kept for reference:
- `services/sdkMiddleware.ts` - Custom Proxy-based middleware
- `services/apiInterceptor.ts` - Alternative interceptor approach

## How It Works Now

### Token Storage and Initialization

When the app starts, `AuthContext` initializes:

```typescript
// 1. Load tokens from AsyncStorage
const storedToken = await AsyncStorage.getItem('token');
const storedRefreshToken = await AsyncStorage.getItem('refresh_token');

// 2. Set them in the SDK client
vitalFitApi.client.setTokens(storedToken, storedRefreshToken);

// 3. Setup callbacks for automatic refresh
vitalFitApi.client.setCallbacks(
  // Called when tokens are refreshed
  async (access: string, refresh: string) => {
    await AsyncStorage.setItem('token', access);
    await AsyncStorage.setItem('refresh_token', refresh);
    setToken(access);
    setRefreshToken(refresh);
  },
  // Called when refresh fails
  async () => {
    await logout(); // Clear everything and redirect to login
  }
);
```

### Automatic Token Refresh

The SDK now handles token refresh automatically:

1. **API Call Made**: Any API call is made (e.g., `vitalFitApi.user.getProfile()`)
2. **401 Detected**: If the server returns 401 Unauthorized
3. **Automatic Refresh**: SDK calls `auth.renewToken()` with the stored refresh token
4. **Callback Triggered**: On success, `onTokenUpdate` callback is called with new tokens
5. **Retry Original**: SDK retries the original API call with the new token
6. **Seamless**: User never notices the token was refreshed

### Login Flow

```typescript
// 1. User logs in
const response = await vitalFitApi.auth.login({ email, password });

// 2. Response now includes both tokens (typed)
const token = response.token;           // access token
const refreshToken = response.refresh_token; // refresh token

// 3. Store tokens (automatically sets them in SDK)
await authLogin(token, refreshToken);
```

## Developer Experience

### Before (v0.2.0 - Manual Wrapping)
```typescript
import { withTokenRefresh } from '@/services/apiInterceptor';

// Had to wrap every call manually
const data = await withTokenRefresh(
  () => vitalFitApi.user.getProfile(token),
  { onLogout: () => logout() }
);
```

### After (v0.3.0 - Automatic)
```typescript
import vitalFitApi from '@/services';

// Just call the SDK directly - refresh is automatic
const data = await vitalFitApi.user.getProfile(token);
```

No wrapping, no callbacks needed in individual API calls. The SDK handles everything.

## Migration Guide

If you're adding new API calls, follow this pattern:

```typescript
// Correct - Just use the SDK directly
import vitalFitApi from '@/services';

async function fetchData() {
  const response = await vitalFitApi.user.getProfile(token);
  return response;
}

// Wrong - Don't import middleware or wrap calls
import { withTokenRefresh } from '@/services/apiInterceptor'; // DON'T
```

## Benefits

1. **Simpler Code**: No need for custom Proxy middleware
2. **Type Safety**: `refresh_token` is now part of the typed response
3. **Automatic Refresh**: Built into the SDK, works everywhere
4. **Less Code**: Removed ~150 lines of custom middleware
5. **Aligned with Next.js**: Same pattern as the web frontend
6. **Better DX**: Developers just import and use the SDK

## Testing

To test automatic token refresh:

1. Login to the app
2. Wait 15 minutes (or manually expire the token in the backend)
3. Make any API call (e.g., navigate to profile, fetch data)
4. The SDK will automatically refresh the token
5. Check console logs for `[AuthContext] Tokens refreshed by SDK`

## Notes

- The refresh endpoint must be implemented in the backend
- If refresh fails, the user is automatically logged out
- Tokens are stored in AsyncStorage for persistence
- The SDK manages request queuing during refresh (prevents duplicate refresh calls)
