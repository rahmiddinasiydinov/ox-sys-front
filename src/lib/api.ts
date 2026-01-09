const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { auth = false, headers = {}, ...rest } = options;

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (auth) {
      const token = this.getToken();
      if (token) {
        (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: requestHeaders,
      ...rest,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Auth endpoints
  async login(email: string) {
    return this.request<{ otp: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verify(email: string, otp: string) {
    return this.request<{ token: string }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  // Company endpoints
  async registerCompany(subdomain: string, token: string) {
    return this.request<{ message: string; role: string; companyId: number }>('/register-company', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ subdomain, token }),
    });
  }

  async deleteCompany(id: number) {
    return this.request<{ message: string }>(`/company/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // Products endpoints
  async getProducts(page: number = 1, size: number = 10) {
    return this.request<any>(`/products?page=${page}&size=${size}`, {
      method: 'GET',
      auth: true,
    });
  }
}

export const api = new ApiClient(API_URL);
