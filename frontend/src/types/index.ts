// User role types (matching backend ACL system)
export enum UserRole {
  ADMIN = 'dev',        // Desenvolvedor (Dev) - Full access
  MODERATOR = 'owner',  // Dono/Dona (Owner) - Business owner access
  USER = 'client',      // Cliente (Client) - Basic client access
  GUEST = 'guest',      // Guest - Unauthenticated user
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Sign up form data
export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Component permission interface
export interface ComponentPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

// Feature flags based on user role
export interface FeatureFlags {
  showAdminPanel: boolean;
  showUserManagement: boolean;
  showAnalytics: boolean;
  showAdvancedFeatures: boolean;
  canModerateContent: boolean;
  canManageUsers: boolean;
}

// ACL Permission types
export interface PagePermission {
  path: string;
  name: string;
  canView: boolean;
  canEdit: boolean;
}

export interface UserPermissions {
  role: string;
  roleName: string;
  permissions: PagePermission[];
  isSuperuser: boolean;
}

export interface RoleData {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageData {
  id: number;
  path: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionMatrix {
  [roleName: string]: {
    [pagePath: string]: {
      canView: boolean;
      canEdit: boolean;
    };
  };
}