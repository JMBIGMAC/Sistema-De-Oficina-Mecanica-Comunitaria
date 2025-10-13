// Dynamic API URL detection for different environments
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  const { protocol, hostname } = window.location;
  // Detecta Codespaces/GitHub dev environments
  if (hostname.endsWith('.github.dev')) {
    // Substitui a porta 3000 por 8000 no subdomínio
    return `${protocol}//${hostname.replace('-3000', '-8000')}/api`;
  }
  return `${protocol}//${hostname}:8000/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  // First try to get token from auth object (primary method)
  const authData = localStorage.getItem('auth');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      if (parsed.token) {
        return parsed.token;
      }
    } catch (error) {
      console.warn('Failed to parse auth data from localStorage');
    }
  }
  
  // Fallback to direct token storage
  return localStorage.getItem('token');
};

// Helper function to create headers with auth token
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  
  return headers;
};

// Helper function to create headers for file uploads
const getFileUploadHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  
  return headers;
};

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Messages API
export const messagesApi = {
  // Get all messages
  async getMessages(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch messages' };
      }

      const data = await response.json();
      return { success: true, data: data.messages };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Create a new message
  async createMessage(subject: string, content: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ subject, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to create message' };
      }

      const data = await response.json();
      return { success: true, data: data.message };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Reply to a message
  async replyToMessage(messageId: string, content: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/reply/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to send reply' };
      }

      const data = await response.json();
      return { success: true, data: data.reply };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Resolve a message
  async resolveMessage(messageId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/resolve/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to resolve message' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Hide a message
  async hideMessage(messageId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/hide/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to hide message' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Get message settings
  async getMessageSettings(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/settings/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch settings' };
      }

      const data = await response.json();
      return { success: true, data: data.settings };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Update message settings
  async updateMessageSettings(settings: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/settings/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to update settings' };
      }

      const data = await response.json();
      return { success: true, data: data.settings };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },
};

// Profile API
export const profileApi = {
  // Get user profile
  async getProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch profile' };
      }

      const data = await response.json();
      return { success: true, data: data.user };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Update user profile with file upload
  async updateProfile(profileData: any, avatarFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (profileData.firstName) formData.append('firstName', profileData.firstName);
      if (profileData.lastName) formData.append('lastName', profileData.lastName);
      if (profileData.email) formData.append('email', profileData.email);
      
      // Add avatar file if provided
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'PUT',
        headers: getFileUploadHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to update profile' };
      }

      const data = await response.json();
      return { success: true, data: data.user };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },
};

// ACL API
export const aclApi = {
  // Get user permissions
  async getUserPermissions(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/acl/permissions/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch permissions' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Get all roles (Dev only)
  async getRoles(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/acl/roles/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch roles' };
      }

      const data = await response.json();
      return { success: true, data: data.roles };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Get all pages (Dev only)
  async getPages(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/acl/pages/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch pages' };
      }

      const data = await response.json();
      return { success: true, data: data.pages };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Get role permissions matrix (Dev only)
  async getRolePermissions(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/acl/role-permissions/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch role permissions' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Update role permissions (Dev only)
  async updateRolePermissions(updates: any[]): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/acl/role-permissions/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to update permissions' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Check if user has permission for a page
  async checkPagePermission(path: string, action: string = 'view'): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/acl/check-permission/?path=${encodeURIComponent(path)}&action=${action}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to check permission' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },
};

// Workshop API
const workshopApi = {
  // Clientes
  async getClientes(search?: string) {
    try {
      const url = search 
        ? `${API_BASE_URL}/clientes/?search=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/clientes/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch clientes' };
      }

      const data = await response.json();
      return { success: true, data: data.clientes };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async getCliente(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch cliente' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async createCliente(clienteData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(clienteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async updateCliente(id: number, clienteData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(clienteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async deleteCliente(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to delete cliente' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Veiculos
  async getVeiculos(search?: string, clienteId?: number) {
    try {
      let url = `${API_BASE_URL}/veiculos/`;
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (clienteId) params.append('cliente_id', clienteId.toString());
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch veiculos' };
      }

      const data = await response.json();
      return { success: true, data: data.veiculos };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async getVeiculo(placa: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/veiculos/${placa}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch veiculo' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async createVeiculo(veiculoData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/veiculos/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(veiculoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async updateVeiculo(placa: string, veiculoData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/veiculos/${placa}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(veiculoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async deleteVeiculo(placa: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/veiculos/${placa}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to delete veiculo' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Servicos
  async getServicos(search?: string) {
    try {
      const url = search 
        ? `${API_BASE_URL}/servicos/?search=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/servicos/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch servicos' };
      }

      const data = await response.json();
      return { success: true, data: data.servicos };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async getServico(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/servicos/${id}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch servico' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async createServico(servicoData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/servicos/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(servicoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async updateServico(id: number, servicoData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/servicos/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(servicoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async deleteServico(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/servicos/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to delete servico' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },
};

const apiExports = {
  messagesApi,
  profileApi,
  aclApi,
  workshopApi,
};

export default apiExports;