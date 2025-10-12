'use client';

import * as React from 'react';

import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  // Authentication disabled - provide demo user immediately
  const demoUser: User = {
    id: '1',
    name: 'Demo User',
    username: 'demo',
    email: 'demo@uptrade.global',
    avatar: '/assets/avatar.png',
    tier: 'ADVANCED',
    cashBalance: 100000,
    isAdmin: true,
  };

  const [state] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: demoUser,
    error: null,
    isLoading: false,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    // Authentication disabled - no session check needed
    return Promise.resolve();
  }, []);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
