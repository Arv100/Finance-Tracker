import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};

const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
};

const setRefreshToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("refresh_token", token);
  }
};

const removeTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/auth/refresh`,
            {
              refresh_token: refreshToken,
            }
          );

          const { access_token, refresh_token: newRefreshToken } =
            response.data;
          setToken(access_token);
          setRefreshToken(newRefreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          removeTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Type definitions
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Transaction {
  id: string;
  user_id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status: "completed" | "pending";
  account: string;
  created_at: string;
  updated_at?: string;
}

export interface TransactionCreate {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status?: "completed" | "pending";
  account: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  balance: number;
  category_summary: CategoryBreakdown[];
  monthly_data: MonthlyData[];
}

export interface DashboardStats {
  total_balance: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_rate: number;
  balance_trend: number;
  income_trend: number;
  expenses_trend: number;
  savings_trend: number;
}

// Authentication API
export const authApi = {
  register: async (userData: UserCreate): Promise<User> => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  login: async (credentials: UserLogin): Promise<Token> => {
    const response = await api.post("/api/auth/login", credentials);
    const tokenData = response.data;

    // Store tokens
    setToken(tokenData.access_token);
    setRefreshToken(tokenData.refresh_token);

    return tokenData;
  },

  logout: () => {
    removeTokens();
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  refreshToken: async (): Promise<Token> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post("/api/auth/refresh", {
      refresh_token: refreshToken,
    });

    const tokenData = response.data;
    setToken(tokenData.access_token);
    setRefreshToken(tokenData.refresh_token);

    return tokenData;
  },

  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

// Transaction API
export const transactionApi = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get("/api/transactions");
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/api/transactions/${id}`);
    return response.data;
  },

  create: async (transaction: TransactionCreate): Promise<Transaction> => {
    const response = await api.post("/api/transactions", transaction);
    return response.data;
  },

  update: async (
    id: string,
    transaction: TransactionCreate
  ): Promise<Transaction> => {
    const response = await api.put(`/api/transactions/${id}`, transaction);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/transactions/${id}`);
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/api/dashboard/stats");
    return response.data;
  },

  getSummary: async (): Promise<FinancialSummary> => {
    const response = await api.get("/api/dashboard/summary");
    console.log(response.data);
    return response.data;
  },
};

// Upload API
export const uploadApi = {
  uploadFile: async (
    file: File
  ): Promise<{ message: string; processed_count: number }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api;
