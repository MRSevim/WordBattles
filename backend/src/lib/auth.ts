import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    /*  crossSubDomainCookies: {
      enabled: process.env.ENV === "production",
      domain: process.env.BASE_DOMAIN!,
    }, */
    defaultCookieAttributes: {
      domain: process.env.BASE_DOMAIN!,
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL!],
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      currentRoomId: { type: "string", optional: true, input: false },
      rankedPoints: { type: "number", optional: false, input: false },
    },
    deleteUser: {
      enabled: true,
    },
  },
});
