'use client';

import * as React from 'react';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  // Authentication disabled - direct access to dashboard
  return <React.Fragment>{children}</React.Fragment>;
}
