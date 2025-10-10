export type User =
  | {
      id: string;
      currentRoomId: string | null;
      rankedScore: number;
      createdAt: number;
      updatedAt: number;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    }
  | null
  | undefined;

//null is for the initial state when we don't know if the user is logged in or not
