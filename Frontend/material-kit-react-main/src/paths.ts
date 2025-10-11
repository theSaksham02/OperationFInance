export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    usa: '/dashboard/usa',
    india: '/dashboard/india',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
