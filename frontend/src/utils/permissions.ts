import { User, UserRole, ComponentPermissions, FeatureFlags } from '../types';

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: UserRole | string): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: (UserRole | string)[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

/**
 * Check if user has admin privileges (Dev)
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, UserRole.ADMIN);
};

/**
 * Check if user has moderator privileges or higher (Owner or Dev)
 */
export const isModerator = (user: User | null): boolean => {
  return hasAnyRole(user, [UserRole.ADMIN, UserRole.MODERATOR]);
};

/**
 * Check if user is authenticated (not guest)
 */
export const isAuthenticated = (user: User | null): boolean => {
  return user !== null && user.role !== UserRole.GUEST;
};

/**
 * Get component permissions based on user role
 */
export const getComponentPermissions = (
  user: User | null,
  resourceType: 'user' | 'content' | 'system' | 'general' = 'general'
): ComponentPermissions => {
  const defaultPermissions: ComponentPermissions = {
    canView: false,
    canEdit: false,
    canDelete: false,
    canCreate: false,
  };

  if (!user) return defaultPermissions;

  switch (user.role) {
    case UserRole.ADMIN:
      return {
        canView: true,
        canEdit: true,
        canDelete: true,
        canCreate: true,
      };

    case UserRole.MODERATOR:
      switch (resourceType) {
        case 'user':
          return {
            canView: true,
            canEdit: false,
            canDelete: false,
            canCreate: false,
          };
        case 'content':
          return {
            canView: true,
            canEdit: true,
            canDelete: true,
            canCreate: true,
          };
        case 'system':
          return defaultPermissions;
        default:
          return {
            canView: true,
            canEdit: true,
            canDelete: false,
            canCreate: true,
          };
      }

    case UserRole.USER:
      switch (resourceType) {
        case 'user':
          return {
            canView: true,
            canEdit: true, // own profile only
            canDelete: false,
            canCreate: false,
          };
        default:
          return {
            canView: true,
            canEdit: false,
            canDelete: false,
            canCreate: false,
          };
      }

    case UserRole.GUEST:
    default:
      return {
        canView: true,
        canEdit: false,
        canDelete: false,
        canCreate: false,
      };
  }
};

/**
 * Get feature flags based on user role
 */
export const getFeatureFlags = (user: User | null): FeatureFlags => {
  const defaultFlags: FeatureFlags = {
    showAdminPanel: false,
    showUserManagement: false,
    showAnalytics: false,
    showAdvancedFeatures: false,
    canModerateContent: false,
    canManageUsers: false,
  };

  if (!user) return defaultFlags;

  switch (user.role) {
    case UserRole.ADMIN:
      return {
        showAdminPanel: true,
        showUserManagement: true,
        showAnalytics: true,
        showAdvancedFeatures: true,
        canModerateContent: true,
        canManageUsers: true,
      };

    case UserRole.MODERATOR:
      return {
        showAdminPanel: false,
        showUserManagement: false,
        showAnalytics: true,
        showAdvancedFeatures: false,
        canModerateContent: true,
        canManageUsers: false,
      };

    case UserRole.USER:
      return {
        showAdminPanel: false,
        showUserManagement: false,
        showAnalytics: false,
        showAdvancedFeatures: false,
        canModerateContent: false,
        canManageUsers: false,
      };

    case UserRole.GUEST:
    default:
      return defaultFlags;
  }
};

/**
 * Role hierarchy for comparison
 */
const roleHierarchy: Record<string, number> = {
  [UserRole.GUEST]: 0,
  [UserRole.USER]: 1,
  [UserRole.MODERATOR]: 2,
  [UserRole.ADMIN]: 3,
};

/**
 * Check if user role has higher or equal level than required role
 */
export const hasRoleLevel = (user: User | null, requiredRole: UserRole | string): boolean => {
  if (!user) return requiredRole === UserRole.GUEST;
  const userLevel = roleHierarchy[user.role] ?? 0;
  const requiredLevel = roleHierarchy[requiredRole] ?? 0;
  return userLevel >= requiredLevel;
};