import { AgentDetail } from './agent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'AGENT';
  licenseNumber?: string;
  phone: string;
  agencyName?: string;
  agencyBusinessNumber?: string;
  agencyAddress?: string;
  agencyRoadAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: AgentDetail | null;
  isAuthenticated: boolean;
}

export interface SignUpFormData {
  // 공인중개사 정보
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  licenseNumber?: string;
  phone: string;

  // 소속 부동산 정보
  agencyName?: string;
  agencyBusinessNumber?: string;
  agencyAddress?: string;
  agencyRoadAddress?: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface EmailVerificationData {
  email: string;
  code: string;
}

export enum VerificationType {
  SIGNUP = 'SIGNUP',
  RESET_PASSWORD = 'RESET_PASSWORD',
}
