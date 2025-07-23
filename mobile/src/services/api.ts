import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'authToken';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  created_by_username: string;
  vote_count: string | number;
}

export interface Vote {
  id: number;
  user_id: number;
  feature_id: number;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface VoteResponse {
  vote: Vote;
  voteCount: number;
  message: string;
}

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    
    // Store token
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', {
      email,
      password,
    });
    
    // Store token
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response: AxiosResponse<{ user: User }> = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },
};

// Features API
export const featuresAPI = {
  getAll: async (): Promise<{ features: Feature[] }> => {
    const response: AxiosResponse<{ features: Feature[] }> = await api.get('/features');
    return response.data;
  },

  getById: async (id: number): Promise<{ feature: Feature }> => {
    const response: AxiosResponse<{ feature: Feature }> = await api.get(`/features/${id}`);
    return response.data;
  },

  create: async (data: { title: string; description: string }): Promise<{ feature: Feature; message: string }> => {
    const response: AxiosResponse<{ feature: Feature; message: string }> = await api.post('/features', data);
    return response.data;
  },

  update: async (id: number, title: string, description: string): Promise<{ feature: Feature; message: string }> => {
    const response: AxiosResponse<{ feature: Feature; message: string }> = await api.put(`/features/${id}`, {
      title,
      description,
    });
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/features/${id}`);
    return response.data;
  },
};

// Votes API
export const votesAPI = {
  create: async (featureId: number): Promise<VoteResponse> => {
    const response: AxiosResponse<VoteResponse> = await api.post('/votes', {
      featureId,
    });
    return response.data;
  },

  delete: async (featureId: number): Promise<{ voteCount: number; message: string }> => {
    const response: AxiosResponse<{ voteCount: number; message: string }> = await api.delete(`/votes/${featureId}`);
    return response.data;
  },

  getByFeature: async (featureId: number): Promise<{
    voteCount: number;
    votes: { userId: number; votedAt: string }[];
  }> => {
    const response = await api.get(`/votes/feature/${featureId}`);
    return {
      voteCount: response.data.voteCount,
      votes: response.data.voters || []
    };
  },

  // Legacy methods (keep for backward compatibility)
  vote: async (featureId: number): Promise<VoteResponse> => {
    return votesAPI.create(featureId);
  },

  removeVote: async (featureId: number): Promise<{ voteCount: number; message: string }> => {
    return votesAPI.delete(featureId);
  },

  getFeatureVotes: async (featureId: number): Promise<{
    voteCount: number;
    votes: { userId: number; votedAt: string }[];
  }> => {
    return votesAPI.getByFeature(featureId);
  },
};

export default api;