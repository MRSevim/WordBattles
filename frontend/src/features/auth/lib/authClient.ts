import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
  /*   advanced: {
    crossSubDomainCookies: {
      enabled: process.env.ENV === "production",
      domain: process.env.BASE_DOMAIN!,
    },
  }, */
  plugins: [
    inferAdditionalFields({
      user: {
        currentRoomId: { type: "string", optional: true, input: false },
        rankedPoints: { type: "number", optional: false, input: false },
      },
    }),
  ],
});
