'use client';
import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';

import { AppConfig } from '@/config/app.config';
import { apiClient } from '@/shared/lib/api';
import { camelizeKeys } from '@/shared/lib/camelize';
import type { AuthState, AuthTokens, LoginCredentials, User } from '@/shared/types/auth.types';
import { useAppConfig } from './config.provider';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true, // Start as loading until auth is initialized
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return { ...initialState, error: action.payload, isLoading: false };
    case 'AUTH_LOGOUT':
      return { ...initialState };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const config = useAppConfig();
  // Only initialize auth when config is definitely ready!
  useEffect(() => {
    if (config && !state.isAuthenticated && state.isLoading) {
      void initializeAuth(config);
    }
  }, [config]);

  async function initializeAuth(config: AppConfig) {
    dispatch({ type: 'AUTH_START' });
    try {
      const token = localStorage.getItem(config.auth.tokenKey || 'access_token');
      const refreshToken = localStorage.getItem(config.auth.refreshTokenKey || 'refresh_token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        apiClient.setAuthToken(token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token, refreshToken: refreshToken || '' },
        });
        try {
          const me = await apiClient.get('/auth/me');
          console.log('Auth verified:', me);
        } catch (err) {
          console.error('/auth/me failed', err);
          if (refreshToken) await refreshAuth();
          else logout();
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: '' });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch({ type: 'AUTH_FAILURE', payload: '' });
    }
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await apiClient.post<{ user: User; tokens: AuthTokens }>(
        '/auth/login',
        credentials
      );
      const { user, tokens } = camelizeKeys(response.data);
      localStorage.setItem('access_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      apiClient.setAuthToken(tokens.accessToken);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: tokens.accessToken, refreshToken: tokens.refreshToken },
      });
    } catch (error: any) {
      const message = error?.message || 'Login failed. Please check your credentials.';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  }

  function logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    apiClient.setAuthToken(null);
    dispatch({ type: 'AUTH_LOGOUT' });
    // Redirect directly to signin after logout
    window.location.href = '/auth/signin';
  }

  async function refreshAuth(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');
      const response = await apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/refresh', {
        refreshToken,
      });
      const { user, tokens } = response.data;
      localStorage.setItem('access_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      apiClient.setAuthToken(tokens.accessToken);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: tokens.accessToken, refreshToken: tokens.refreshToken },
      });
    } catch (error) {
      logout();
      throw error;
    }
  }

  function updateUser(userUpdates: Partial<User>): void {
    if (state.user) {
      const updatedUser = { ...state.user, ...userUpdates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userUpdates });
    }
  }

  const value: AuthContextValue = { ...state, login, logout, refreshAuth, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
