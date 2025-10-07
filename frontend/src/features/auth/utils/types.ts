export type User = {
  id: string;
  createdAt: number;
  updatedAt: number;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
} | null;
