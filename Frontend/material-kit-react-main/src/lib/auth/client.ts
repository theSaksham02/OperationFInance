'use client';

import type { User } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8001';
const TOKEN_STORAGE_KEY = 'tradesphere-access-token';

export interface SignUpParams {
  username: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

function mapUser(payload: Record<string, unknown>): User {
  return {
    id: String(payload.id ?? ''),
    username: String(payload.username ?? ''),
    email: String(payload.email ?? ''),
    tier: (payload.tier as User['tier']) ?? 'BEGINNER',
    cashBalance: Number(payload.cash_balance ?? payload.cashBalance ?? 0),
    isAdmin: Boolean(payload.is_admin ?? payload.isAdmin ?? false),
    avatar: (payload.avatar as string | undefined | null) ?? null,
    name: (payload.name as string | undefined | null) ?? String(payload.username ?? ''),
  };
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = await response.json();

    if (typeof body?.detail === 'string') {
      return body.detail;
    }

    if (Array.isArray(body?.detail) && body.detail.length > 0 && typeof body.detail[0]?.msg === 'string') {
      return body.detail[0].msg;
    }

    if (typeof body?.message === 'string') {
      return body.message;
    }
  } catch {
    // ignore parsing failures
  }

  if (response.status === 401) {
    return 'Invalid credentials';
  }

  return response.statusText || 'Request failed';
}

function getToken(): string | null {
  return globalThis.localStorage.getItem(TOKEN_STORAGE_KEY);
}

function setToken(token: string | null): void {
  if (token) {
    globalThis.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    globalThis.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: params.username, email: params.email, password: params.password }),
      });

      if (!response.ok) {
        return { error: await parseError(response) };
      }

      // Automatically sign-in after registration for convenience.
      return this.signInWithPassword({ username: params.username, password: params.password });
    } catch (error) {
      console.error(error);
      return { error: 'Unable to register right now. Please try again.' };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const body = new URLSearchParams();
    body.set('username', params.username);
    body.set('password', params.password);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (!response.ok) {
        return { error: await parseError(response) };
      }

      const payload = (await response.json()) as { access_token: string };

      if (!payload?.access_token) {
        return { error: 'Authentication response missing access token' };
      }

      setToken(payload.access_token);
      return {};
    } catch (error) {
      console.error(error);
      return { error: 'Unable to sign in right now. Please try again.' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = getToken();

    if (!token) {
      return { data: null };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        setToken(null);
        return { data: null };
      }

      if (!response.ok) {
        return { error: await parseError(response) };
      }

      const payload = (await response.json()) as Record<string, unknown>;
      return { data: mapUser(payload) };
    } catch (error) {
      console.error(error);
      return { error: 'Unable to verify session. Please try again.' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    setToken(null);
    return {};
  }
}

export const authClient = new AuthClient();
