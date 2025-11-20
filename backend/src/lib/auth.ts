import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma/prisma";

const isProd = process.env.ENV === "production";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  ...(isProd && {
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain: process.env.BASE_DOMAIN!,
      },
    },
  }),
  trustedOrigins: ["*.wordbattles.net", "http://localhost:3000"],
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      currentRoomId: { type: "string", optional: true, input: false },
    },
    deleteUser: {
      enabled: true,
    },
  },
});
