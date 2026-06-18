// ─── API Response Types ───────────────────────────────────────────────────────

import { UserProfile, Organization } from './types';

// Generic API Response
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

// API Error
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

// Auth Responses
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
  organization: Organization;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface MeResponse {
  user: UserProfile;
  organization: Organization;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Common Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Muvaffaqiyatli bajarildi',
  ERROR: 'Xatolik yuz berdi',
  NETWORK_ERROR: 'Tarmoq xatosi',
  TIMEOUT: 'So\'rov vaqti tugadi',
  UNAUTHORIZED: 'Avtorizatsiya xatosi',
  FORBIDDEN: 'Ruxsat yo\'q',
  NOT_FOUND: 'Topilmadi',
  VALIDATION_ERROR: 'Ma\'lumotlar noto\'g\'ri',
  SERVER_ERROR: 'Server xatosi',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
} as const;
