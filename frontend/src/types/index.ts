// User role types for Mechanical Workshop System
export enum UserRole {
  ADMIN = 'dev',        // Gerente/Administrador (Admin) - Full system monitoring
  MODERATOR = 'owner',  // Mecânico/Trabalhador (Worker) - Workshop operations
  USER = 'client',      // Cliente (Client) - Workshop customer
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

// Workshop System Types

export interface Cliente {
  id: number;
  nome: string;
  cpf_cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  created_at: string;
  updated_at: string;
  veiculos_count?: number;
}

export type TipoCombustivel = 'gasolina' | 'alcool' | 'flex' | 'diesel' | 'eletrico' | 'hibrido';

export interface Veiculo {
  placa: string;
  cliente: number;
  cliente_id?: number;
  cliente_nome?: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  quilometragem: number;
  chassi: string;
  tipo_combustivel: TipoCombustivel;
  created_at: string;
  updated_at: string;
}

export interface Servico {
  id: number;
  descricao: string;
  preco_padrao: number;
  created_at: string;
  updated_at: string;
}