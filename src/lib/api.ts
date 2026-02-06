// API service for making requests to the backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Product {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Get JWT token from localStorage (set by AuthContext after Firebase sync)
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic HTTP methods with authentication
  async get(path: string): Promise<any> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Failed to GET ${path}`);
    }
    return response.json();
  }

  async post(path: string, data?: any): Promise<any> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Failed to POST ${path}`);
    }
    return response.json();
  }

  async put(path: string, data?: any): Promise<any> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Failed to PUT ${path}`);
    }
    return response.json();
  }

  async delete(path: string): Promise<any> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Failed to DELETE ${path}`);
    }
    return response.json();
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.get('/products');
  }

  async getProduct(id: string): Promise<Product> {
    return this.get(`/products/${id}`);
  }

  async createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<{ productId: string }> {
    return this.post('/products', product);
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    return this.put(`/products/${id}`, updates);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.delete(`/products/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  }
}

export const api = new ApiService(API_URL);
