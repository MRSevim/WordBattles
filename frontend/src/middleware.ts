import { NextRequest, NextResponse } from "next/server";
import { routeStrings } from "./utils/routeStrings";
import { getSessionCookie } from "better-auth/cookies";

const authenticatedRoutes = [routeStrings.profile];

export default function middleware(request: NextRequest) {
  const requiresAuth = authenticatedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie && requiresAuth) {
    return NextResponse.redirect(new URL(routeStrings.signin, request.url));
  }

  if (
    sessionCookie &&
    request.nextUrl.pathname.startsWith(routeStrings.signin)
  ) {
    return NextResponse.redirect(new URL(routeStrings.home, request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
