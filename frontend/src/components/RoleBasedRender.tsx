import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { hasRole, hasAnyRole, hasRoleLevel } from '../utils/permissions';

interface RoleBasedRenderProps {
  children: ReactNode;
  roles?: (UserRole | string)[];
  requiredRole?: UserRole | string;
  specificRole?: UserRole | string;
  requireAuth?: boolean;
  fallback?: ReactNode;
  mode?: 'any' | 'all' | 'level' | 'specific';
}

/**
 * Component that conditionally renders children based on user roles and permissions
 */
const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({
  children,
  roles = [],
  requiredRole,
  specificRole,
  requireAuth = false,
  fallback = null,
  mode = 'any',
}) => {
  const { user, isAuthenticated } = useAuth();

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // If no user and not checking for guest permissions
  if (!user && requireAuth) {
    return <>{fallback}</>;
  }

  // Check specific role
  if (specificRole) {
    if (!hasRole(user, specificRole)) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // Check required role level
  if (requiredRole) {
    if (!hasRoleLevel(user, requiredRole)) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // Check roles array
  if (roles.length > 0) {
    let hasPermission = false;

    switch (mode) {
      case 'any':
        hasPermission = hasAnyRole(user, roles);
        break;
      case 'all':
        hasPermission = roles.every(role => hasRole(user, role));
        break;
      case 'level':
        hasPermission = roles.some(role => hasRoleLevel(user, role));
        break;
      case 'specific':
        hasPermission = roles.some(role => hasRole(user, role));
        break;
      default:
        hasPermission = hasAnyRole(user, roles);
    }

    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default RoleBasedRender;