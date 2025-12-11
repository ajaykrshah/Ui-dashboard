export interface User {
  username: string;
  full_name: string;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  department?: string;
  title?: string;
  groups: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  authMethod: 'ldap' | 'development';
}
