'use client';

import type { User } from '@/types/user';

<<<<<<< HEAD
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

function generateToken(): string {
  const arr = new Uint8Array(12);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;
=======
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8001';
const TOKEN_STORAGE_KEY = 'tradesphere-access-token';
>>>>>>> 63491e5a34cc24d45fac377269cafe6f203b10de

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

function getStorage(): Storage | null {
  const globalWithWindow = globalThis as typeof globalThis & { window?: Window };
  const win = globalWithWindow.window;

  if (!win || win.localStorage === undefined) {
    return null;
  }

  return win.localStorage;
}

function getToken(): string | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  return storage.getItem(TOKEN_STORAGE_KEY);
}

function setToken(token: string | null): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (token) {
    storage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    storage.removeItem(TOKEN_STORAGE_KEY);
  }
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
<<<<<<< HEAD
    const { firstName, lastName, email, password } = params;

    try {
      console.log('Attempting signup with URL:', `${API_BASE_URL}/auth/register`);
      
      // Call the FastAPI backend /auth/register endpoint
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // or use firstName+lastName as username
          email: email,
          password: password,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
        console.error('Registration error:', errorData);
        return { error: errorData.detail || 'Registration failed' };
      }

      // After successful registration, automatically log in
      return await this.signInWithPassword({ email, password });
    } catch (err) {
      console.error('Network error during signup:', err);
      return { error: `Network error: ${err instanceof Error ? err.message : 'Please try again.'}` };
=======
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
>>>>>>> 63491e5a34cc24d45fac377269cafe6f203b10de
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
<<<<<<< HEAD
      // Call the FastAPI backend /auth/login endpoint
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI OAuth2PasswordRequestForm expects 'username'
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
        return { error: errorData.detail || 'Invalid credentials' };
      }

      const data = await response.json();
      const token = data.access_token;

      // Store JWT token in localStorage
      localStorage.setItem('custom-auth-token', token);

      return {};
    } catch (err) {
      return { error: 'Network error. Please try again.' };
=======
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
>>>>>>> 63491e5a34cc24d45fac377269cafe6f203b10de
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
<<<<<<< HEAD
    const token = localStorage.getItem('custom-auth-token');
=======
    const token = getToken();
>>>>>>> 63491e5a34cc24d45fac377269cafe6f203b10de

    if (!token) {
      return { data: null };
    }

    try {
<<<<<<< HEAD
      // Call the FastAPI backend /auth/me endpoint to get current user
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Token might be invalid or expired
        localStorage.removeItem('custom-auth-token');
        return { data: null };
      }

      const userData = await response.json();
      
      // Map backend user to frontend User type
      return {
        data: {
          id: userData.id,
          avatar: '/assets/avatar.png', // Default avatar
          firstName: userData.username, // Adjust based on your backend schema
          lastName: '',
          email: userData.email,
        },
      };
    } catch (err) {
      return { data: null, error: 'Failed to fetch user data' };
=======
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
>>>>>>> 63491e5a34cc24d45fac377269cafe6f203b10de
    }
  }

  async signOut(): Promise<{ error?: string }> {
    setToken(null);
    return {};
  }
}

export const authClient = new AuthClient();

export function getAccessToken(): string | null {
  return getToken();
}
