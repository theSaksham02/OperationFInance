export interface User {
  id: string;
  username: string;
  email: string;
  tier: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  cashBalance: number;
  isAdmin: boolean;
  avatar?: string | null;
  name?: string | null;
}
