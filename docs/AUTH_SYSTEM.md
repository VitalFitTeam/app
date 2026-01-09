# Authentication System Documentation

## Overview

This app now has a complete authentication system with automatic token refresh handling. The system consists of:

1. **AuthContext** - Manages authentication state and tokens
2. **API Interceptor** - Automatically handles 401 errors and token refresh
3. **UserContext** - Manages user data (existing)

## Architecture

### 1. AuthContext (`contexts/AuthContext.tsx`)

The AuthContext provides:
- `isAuthenticated`: Boolean indicating if user is logged in
- `isLoading`: Boolean for initialization state
- `token`: Current JWT access token
- `refreshToken`: Refresh token for getting new access tokens
- `login(token, refreshToken)`: Store tokens and set authenticated state
- `logout()`: Clear tokens and redirect to login
- `refresh()`: Get new access token using refresh_token

### 2. API Interceptor (`services/apiInterceptor.ts`)

The interceptor provides automatic token refresh when API calls fail with 401:

```typescript
import { withTokenRefresh } from '@/services/apiInterceptor';

// Wrap your API call
const data = await withTokenRefresh(
  () => vitalFitApi.someEndpoint(params),
  {
    onTokenRefresh: async () => {
      // Optional: called after successful token refresh
      console.log('Token refreshed');
    },
    onLogout: async () => {
      // Optional: called when refresh fails
      router.replace('/(auth)/login');
    }
  }
);
```

### How it works:

1. API call is made
2. If it returns 401 (token expired):
   - Automatically calls the refresh endpoint with `refresh_token`
   - Gets new `token` and `refresh_token`
   - Stores them in AsyncStorage
   - Retries the original API call
3. If refresh fails:
   - Clears tokens
   - Calls `onLogout` callback
   - User needs to login again

### 3. Token Refresh Flow

```
User makes API request
    ↓
Request fails with 401
    ↓
Interceptor catches error
    ↓
Call /auth/refresh with refresh_token
    ↓
Get new token + refresh_token
    ↓
Store new tokens
    ↓
Retry original request
    ↓
Return result to user
```

## Usage Examples

### 1. Login (Already Implemented)

```typescript
const { login } = useAuth();
const { fetchUser } = useUser();

// After successful login API call
await login(token, refreshToken);
await fetchUser(); // Load user data
router.replace('/(tabs)/dashboard');
```

### 2. Logout

```typescript
const { logout } = useAuth();

await logout(); // Clears tokens and redirects to login
```

### 3. Check if Authenticated

```typescript
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) return <LoadingScreen />;
if (!isAuthenticated) return <LoginScreen />;
return <Dashboard />;
```

### 4. Using API Interceptor (Recommended for all API calls)

```typescript
import { withTokenRefresh } from '@/services/apiInterceptor';
import { useRouter } from 'expo-router';

// In your component
const router = useRouter();

try {
  const classes = await withTokenRefresh(
    () => vitalFitApi.classes.getAll(),
    {
      onLogout: async () => {
        router.replace('/(auth)/login');
      }
    }
  );
  // Use classes data
} catch (error) {
  console.error('Error:', error);
}
```

### 5. Manual Token Refresh

```typescript
const { refresh } = useAuth();

const success = await refresh();
if (success) {
  // Token refreshed, continue
} else {
  // Refresh failed, user logged out
}
```

## Integration Steps

### For Backend Developer

Your SDK needs to implement a refresh endpoint:

```typescript
// In the SDK
auth: {
  refresh: async (data: { refresh_token: string }) => {
    return await client.post('/auth/refresh', data);
  }
}
```

Expected response:
```json
{
  "token": "new_jwt_token_here",
  "refresh_token": "new_refresh_token_here"
}
```

### For Frontend Developers

1. **Always use the AuthContext for login/logout:**
   ```typescript
   const { login, logout } = useAuth();
   ```

2. **Wrap API calls that require authentication with `withTokenRefresh`:**
   ```typescript
   import { withTokenRefresh } from '@/services/apiInterceptor';

   const data = await withTokenRefresh(() => vitalFitApi.getData());
   ```

3. **Check authentication state when needed:**
   ```typescript
   const { isAuthenticated } = useAuth();
   ```

## File Structure

```
app/
├── contexts/
│   ├── AuthContext.tsx          # Authentication state management
│   └── UserContext.tsx          # User data management
├── services/
│   ├── apiInterceptor.ts        # Automatic token refresh
│   └── vitalfitSdk.ts          # SDK instance
└── app/
    └── (auth)/
        ├── login.tsx            # Uses AuthContext
        └── confirm-email.tsx    # Uses AuthContext
```

## Important Notes

1. **Token Storage**: Both `token` and `refresh_token` are stored in AsyncStorage
2. **Automatic Refresh**: The interceptor handles token refresh automatically
3. **Request Queuing**: If multiple requests fail simultaneously, only one refresh is performed
4. **Security**: Refresh tokens are stored securely in AsyncStorage
5. **Logout on Failure**: If refresh fails, user is automatically logged out

## Testing Token Refresh

To test the token refresh flow:

1. Login normally
2. Wait for token to expire (or manually set a short expiration in backend)
3. Make an API call
4. Watch the console:
   - You'll see "Token expired (401), attempting refresh..."
   - Then "Token refreshed successfully"
   - Original request completes successfully

## Migration Guide

If you have existing API calls without the interceptor:

**Before:**
```typescript
const data = await vitalFitApi.getData();
```

**After:**
```typescript
import { withTokenRefresh } from '@/services/apiInterceptor';

const data = await withTokenRefresh(() => vitalFitApi.getData());
```

## Common Issues

### Issue: "Session expired. Please login again."
- **Cause**: Refresh token is invalid or expired
- **Solution**: User needs to login again

### Issue: API call fails with 401 immediately after login
- **Cause**: Token not stored correctly
- **Solution**: Ensure you're using `authLogin(token, refreshToken)` from AuthContext

### Issue: Token refresh loops infinitely
- **Cause**: Backend refresh endpoint is also returning 401
- **Solution**: Check backend refresh endpoint implementation

## Support

For questions about:
- **AuthContext**: Contact frontend team
- **API Interceptor**: Contact frontend team
- **Backend refresh endpoint**: Contact backend team (@your-backend-dev)
