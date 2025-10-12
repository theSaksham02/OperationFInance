'use client';

import { authClient, getAccessToken, API_BASE_URL } from '@/lib/auth/client';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const body = await response.json();

    if (typeof body?.detail === 'string') {
      return body.detail;
    }

    if (Array.isArray(body?.detail) && body.detail.length > 0) {
      const first = body.detail[0];
      if (typeof first?.msg === 'string') {
        return first.msg;
      }
    }

    if (typeof body?.message === 'string') {
      return body.message;
    }
  } catch (error) {
    console.error('Failed to parse error response', error);
  }

  if (response.status === 401) {
    return 'Session expired. Please sign in again.';
  }

  return response.statusText || 'Request failed';
}

export async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();

  if (!token) {
    throw new ApiError('You are not authenticated.', 401);
  }

  const headers = new Headers(init.headers ?? undefined);

  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    await authClient.signOut();
    throw new ApiError('Session expired. Please sign in again.', 401);
  }

  return response;
}
