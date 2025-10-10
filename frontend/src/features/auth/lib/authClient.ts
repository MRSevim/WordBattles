import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
  plugins: [
    inferAdditionalFields({
      user: {
        currentRoomId: { type: "string", optional: true, input: false },
        rankedScore: { type: "number", optional: false, input: false },
      },
    }),
  ],
});
