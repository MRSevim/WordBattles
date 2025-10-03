import { DefaultSession, ExpressAuth } from "@auth/express";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "@auth/express/providers/google";

declare module "@auth/express" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** extend with id */
    id: string;
  }
}

//Creates a user in db on register but uses jwt as session strategy
export const getExpressAuth = () =>
  ExpressAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google],
    session: { strategy: "jwt" },
    callbacks: {
      jwt({ token, user }) {
        if (user && user.id) {
          // User is available during sign-in, adds id to jwt
          token.id = user.id;
        }
        return token;
      },
      session({ session, token }) {
        //  adds id to user of session
        session.user.id = token.id;
        return session;
      },
    },
  });
