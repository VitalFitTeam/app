# SDK Middleware - Automatic Token Refresh

## Overview

The SDK middleware automatically intercepts **ALL** API calls and handles token refresh when tokens expire (401 errors). You don't need to wrap each call manually!

## How It Works

The middleware uses JavaScript **Proxy** to intercept all SDK function calls. When any call fails with 401:

1. Automatically calls `/auth/refresh` with your `refresh_token`
2. Gets new `token` and `refresh_token`
3. Stores them in AsyncStorage
4. **Retries the original request** automatically
5. Returns the result to you

## Setup (Already Done!)

### Files Created:
- `services/sdkMiddleware.ts` - The Proxy-based middleware
- `services/index.ts` - Exports the wrapped SDK
- `services/vitalfitSdk.ts` - Updated to export raw SDK

## How to Use

### Option 1: Use the Middleware Version (Recommended)

Simply import from `@/services` instead of `@/services/vitalfitSdk`:

```typescript
// Old way (no auto-refresh)
import vitalFitApi from '@/services/vitalfitSdk';

// New way (auto-refresh enabled!)
import vitalFitApi from '@/services';

// Use it exactly the same way - no changes needed!
const classes = await vitalFitApi.classes.getAll();
const user = await vitalFitApi.user.WhoAmI(token);
const qr = await vitalFitApi.user.QrToken(token);

// ALL calls are automatically protected! 🎉
```

### Option 2: Update All Imports (Recommended)

Update all your files to import from `@/services` instead of `@/services/vitalfitSdk`:

**Before:**
```typescript
import vitalFitApi from '@/services/vitalfitSdk';
```

**After:**
```typescript
import vitalFitApi from '@/services';
```

That's it! No other code changes needed.

## Migration Guide

### Quick Migration

Run this find-and-replace across your project:

**Find:**
```
from '@/services/vitalfitSdk'
```

**Replace with:**
```
from '@/services'
```

This will automatically enable auto-refresh for all SDK calls!

## Example: Before & After

### Before (Manual Import)
```typescript
import vitalFitApi from '@/services/vitalfitSdk';

export const QRModal = ({ token }) => {
    const fetchQR = async () => {
        // This will fail with 401 if token expires
        const response = await vitalFitApi.user.QrToken(token);
        // User has to login again ❌
    };
};
```

### After (With Middleware)
```typescript
import vitalFitApi from '@/services'; // ← Only change!

export const QRModal = ({ token }) => {
    const fetchQR = async () => {
        // Automatically refreshes token if it expires!
        const response = await vitalFitApi.user.QrToken(token);
        // Returns data seamlessly ✅
    };
};
```

## What Gets Intercepted?

**Everything!** The Proxy intercepts:

- `vitalFitApi.auth.*` (except `refresh` to avoid loops)
- `vitalFitApi.user.*`
- `vitalFitApi.classes.*`
- `vitalFitApi.client.*`
- Any other SDK methods

## How Token Refresh Works

### Scenario: Token Expires

```
User makes API call
    ↓
Token expired (401)
    ↓
Middleware catches it
    ↓
Calls /auth/refresh with refresh_token
    ↓
Gets new tokens
    ↓
Stores in AsyncStorage
    ↓
Retries original call
    ↓
User gets their data!
```

### Multiple Simultaneous Calls

If 5 calls fail at the same time:

```
Call 1 → 401 → Start refresh
Call 2 → 401 → Wait for Call 1's refresh
Call 3 → 401 → Wait for Call 1's refresh
Call 4 → 401 → Wait for Call 1's refresh
Call 5 → 401 → Wait for Call 1's refresh
    ↓
Refresh completes (1 API call)
    ↓
All 5 calls retry with new token
    ↓
All succeed!
```

Only **one** refresh call is made, even with multiple concurrent failures!

## Console Logs

You'll see helpful logs:

```
[SDK Middleware] 401 detected, attempting token refresh...
[SDK Middleware] Refreshing token...
[SDK Middleware] Token refreshed successfully
```

## Error Handling

### If Refresh Succeeds
- Original request is retried
- User gets their data
- Nothing changes from their perspective

### If Refresh Fails
- Tokens are cleared
- Error thrown: "Session expired. Please login again."
- Your components should catch this and redirect to login

```typescript
try {
    const data = await vitalFitApi.getData();
} catch (error) {
    if (error.message === 'Session expired. Please login again.') {
        router.replace('/(auth)/login');
    }
}
```

## Special Cases

### Using Raw SDK (No Middleware)

If you need to use the SDK without middleware (rare):

```typescript
import { rawVitalFitApi } from '@/services';

// This won't auto-refresh
const data = await rawVitalFitApi.someCall();
```

### Login/Auth Flows

Login and refresh calls work normally:

```typescript
import vitalFitApi from '@/services';

// These don't need interception, they work as expected
const response = await vitalFitApi.auth.login({ email, password });
const refreshed = await vitalFitApi.auth.refresh({ refresh_token });
```

## Testing

To test the auto-refresh:

1. Login normally
2. Wait for token to expire (or set short expiration in backend)
3. Make any SDK call
4. Check console logs - you should see:
   ```
   [SDK Middleware] 401 detected, attempting token refresh...
   [SDK Middleware] Token refreshed successfully
   ```
5. Your call should succeed!

## Performance

- **Zero overhead** when token is valid
- Only adds one extra request when token expires (the refresh call)
- Request queuing prevents multiple refresh calls

## Compatibility

Works with:
- ✅ All SDK methods
- ✅ Async/await
- ✅ Promise chains
- ✅ Error handling
- ✅ TypeScript type checking

## Summary

**Before:** Had to manually wrap every call or risk 401 errors

**After:** Import from `@/services` and everything works automatically!

```typescript
// That's it! One line change per file.
import vitalFitApi from '@/services';

// Everything else stays the same
const data = await vitalFitApi.anything();
```

🎉 **No more manual wrapping!**
