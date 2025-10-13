import {
  hasRole,
  hasAnyRole,
  isAdmin,
  isModerator,
  isAuthenticated,
  getComponentPermissions,
  getFeatureFlags,
  hasRoleLevel,
} from '../permissions';
import { User, UserRole } from '../../types';

// Mock user data
const adminUser: User = {
  id: '1',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: UserRole.ADMIN,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const moderatorUser: User = {
  id: '2',
  email: 'mod@example.com',
  firstName: 'Moderator',
  lastName: 'User',
  role: UserRole.MODERATOR,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const regularUser: User = {
  id: '3',
  email: 'user@example.com',
  firstName: 'Regular',
  lastName: 'User',
  role: UserRole.USER,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const guestUser: User = {
  id: '4',
  email: 'guest@example.com',
  firstName: 'Guest',
  lastName: 'User',
  role: UserRole.GUEST,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Permission Utilities', () => {
  describe('hasRole', () => {
    it('should return true when user has the specified role', () => {
      expect(hasRole(adminUser, UserRole.ADMIN)).toBe(true);
      expect(hasRole(moderatorUser, UserRole.MODERATOR)).toBe(true);
      expect(hasRole(regularUser, UserRole.USER)).toBe(true);
    });

    it('should return false when user does not have the specified role', () => {
      expect(hasRole(adminUser, UserRole.USER)).toBe(false);
      expect(hasRole(regularUser, UserRole.ADMIN)).toBe(false);
    });

    it('should return false when user is null', () => {
      expect(hasRole(null, UserRole.ADMIN)).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true when user has any of the specified roles', () => {
      expect(hasAnyRole(adminUser, [UserRole.ADMIN, UserRole.MODERATOR])).toBe(true);
      expect(hasAnyRole(moderatorUser, [UserRole.ADMIN, UserRole.MODERATOR])).toBe(true);
    });

    it('should return false when user does not have any of the specified roles', () => {
      expect(hasAnyRole(regularUser, [UserRole.ADMIN, UserRole.MODERATOR])).toBe(false);
    });

    it('should return false when user is null', () => {
      expect(hasAnyRole(null, [UserRole.ADMIN])).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin users', () => {
      expect(isAdmin(adminUser)).toBe(true);
    });

    it('should return false for non-admin users', () => {
      expect(isAdmin(moderatorUser)).toBe(false);
      expect(isAdmin(regularUser)).toBe(false);
      expect(isAdmin(guestUser)).toBe(false);
      expect(isAdmin(null)).toBe(false);
    });
  });

  describe('isModerator', () => {
    it('should return true for moderators and admins', () => {
      expect(isModerator(adminUser)).toBe(true);
      expect(isModerator(moderatorUser)).toBe(true);
    });

    it('should return false for regular users and guests', () => {
      expect(isModerator(regularUser)).toBe(false);
      expect(isModerator(guestUser)).toBe(false);
      expect(isModerator(null)).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true for authenticated users', () => {
      expect(isAuthenticated(adminUser)).toBe(true);
      expect(isAuthenticated(moderatorUser)).toBe(true);
      expect(isAuthenticated(regularUser)).toBe(true);
    });

    it('should return false for guests and null users', () => {
      expect(isAuthenticated(guestUser)).toBe(false);
      expect(isAuthenticated(null)).toBe(false);
    });
  });

  describe('hasRoleLevel', () => {
    it('should return true when user role level meets or exceeds required level', () => {
      expect(hasRoleLevel(adminUser, UserRole.USER)).toBe(true);
      expect(hasRoleLevel(adminUser, UserRole.MODERATOR)).toBe(true);
      expect(hasRoleLevel(adminUser, UserRole.ADMIN)).toBe(true);
      expect(hasRoleLevel(moderatorUser, UserRole.USER)).toBe(true);
      expect(hasRoleLevel(moderatorUser, UserRole.MODERATOR)).toBe(true);
    });

    it('should return false when user role level is below required level', () => {
      expect(hasRoleLevel(regularUser, UserRole.MODERATOR)).toBe(false);
      expect(hasRoleLevel(regularUser, UserRole.ADMIN)).toBe(false);
      expect(hasRoleLevel(moderatorUser, UserRole.ADMIN)).toBe(false);
    });

    it('should handle guest level requirements correctly', () => {
      expect(hasRoleLevel(null, UserRole.GUEST)).toBe(true);
      expect(hasRoleLevel(guestUser, UserRole.GUEST)).toBe(true);
    });
  });

  describe('getComponentPermissions', () => {
    it('should return correct permissions for admin users', () => {
      const permissions = getComponentPermissions(adminUser);
      expect(permissions.canView).toBe(true);
      expect(permissions.canEdit).toBe(true);
      expect(permissions.canDelete).toBe(true);
      expect(permissions.canCreate).toBe(true);
    });

    it('should return correct permissions for moderator users', () => {
      const permissions = getComponentPermissions(moderatorUser);
      expect(permissions.canView).toBe(true);
      expect(permissions.canEdit).toBe(true);
      expect(permissions.canDelete).toBe(false);
      expect(permissions.canCreate).toBe(true);
    });

    it('should return correct permissions for regular users', () => {
      const permissions = getComponentPermissions(regularUser);
      expect(permissions.canView).toBe(true);
      expect(permissions.canEdit).toBe(false);
      expect(permissions.canDelete).toBe(false);
      expect(permissions.canCreate).toBe(false);
    });

    it('should return no permissions for null users', () => {
      const permissions = getComponentPermissions(null);
      expect(permissions.canView).toBe(false);
      expect(permissions.canEdit).toBe(false);
      expect(permissions.canDelete).toBe(false);
      expect(permissions.canCreate).toBe(false);
    });
  });

  describe('getFeatureFlags', () => {
    it('should return all features enabled for admin users', () => {
      const flags = getFeatureFlags(adminUser);
      expect(flags.showAdminPanel).toBe(true);
      expect(flags.showUserManagement).toBe(true);
      expect(flags.showAnalytics).toBe(true);
      expect(flags.showAdvancedFeatures).toBe(true);
      expect(flags.canModerateContent).toBe(true);
      expect(flags.canManageUsers).toBe(true);
    });

    it('should return limited features for moderator users', () => {
      const flags = getFeatureFlags(moderatorUser);
      expect(flags.showAdminPanel).toBe(false);
      expect(flags.showUserManagement).toBe(false);
      expect(flags.showAnalytics).toBe(true);
      expect(flags.showAdvancedFeatures).toBe(false);
      expect(flags.canModerateContent).toBe(true);
      expect(flags.canManageUsers).toBe(false);
    });

    it('should return minimal features for regular users', () => {
      const flags = getFeatureFlags(regularUser);
      expect(flags.showAdminPanel).toBe(false);
      expect(flags.showUserManagement).toBe(false);
      expect(flags.showAnalytics).toBe(false);
      expect(flags.showAdvancedFeatures).toBe(false);
      expect(flags.canModerateContent).toBe(false);
      expect(flags.canManageUsers).toBe(false);
    });

    it('should return no features for null users', () => {
      const flags = getFeatureFlags(null);
      expect(flags.showAdminPanel).toBe(false);
      expect(flags.showUserManagement).toBe(false);
      expect(flags.showAnalytics).toBe(false);
      expect(flags.showAdvancedFeatures).toBe(false);
      expect(flags.canModerateContent).toBe(false);
      expect(flags.canManageUsers).toBe(false);
    });
  });
});