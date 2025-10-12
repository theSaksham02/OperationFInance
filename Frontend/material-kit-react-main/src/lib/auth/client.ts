'use client';

import type { User } from '@/types/user';

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

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
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
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    try {
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
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    try {
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
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
