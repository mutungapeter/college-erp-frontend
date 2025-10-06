import { useEffect, useCallback } from 'react';

import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userLoggedIn } from '@/store/services/auth/authSlice';
import { useGetPermissionsQuery } from '@/store/services/auth/authService';

export const usePermissions = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, loading } = useAppSelector((state) => state.auth);

  // Check if we need to fetch permissions
  const needsPermissions =
    accessToken &&
    user &&
    (!user.role?.permissions || user.role.permissions.length === 0);

  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
    error: permissionsError,
    refetch,
  } = useGetPermissionsQuery(undefined, {
    skip: !needsPermissions,
  });

  // Update user with permissions when data is received
  useEffect(() => {
    if (permissionsData && accessToken) {
      dispatch(
        userLoggedIn({
          accessToken,
          refreshToken: Cookies.get('refreshToken') || '',
          user: permissionsData,
        }),
      );
    }
  }, [permissionsData, accessToken, dispatch]);

  // Retry function for failed requests
  const retryPermissions = useCallback(() => {
    if (permissionsError && needsPermissions) {
      refetch();
    }
  }, [permissionsError, needsPermissions, refetch]);

  return {
    permissions: user?.role?.permissions || [],
    isLoadingPermissions: isLoadingPermissions || (loading && needsPermissions),
    permissionsError,
    retryPermissions,
    hasPermissions: user?.role?.permissions && user.role.permissions.length > 0,
  };
};
