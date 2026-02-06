import { NextRequest, NextResponse } from "next/server";
import { routeStrings } from "./utils/routeStrings";
import { getSessionCookie } from "better-auth/cookies";
import { Lang } from "../../types";
import { availableLocales } from "./features/language/utils/helpers";

const authenticatedRoutes = [routeStrings.profile];

/** Extract the subdomain from a host string */
function extractSubdomain(host: string): string | null {
  const parts = host.split(".");
  if (parts.length <= 2) return null;
  return parts[0]; // e.g., "en" for en.domain.com
}

/** Strip the first subdomain */
function stripFirstSubdomain(host: string): string {
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  return parts.slice(1).join(".");
}

/** Detect browser preferred locale from Accept-Language header */
function detectBrowserLocale(req: NextRequest): Lang | null {
  const header = req.headers.get("accept-language");
  if (!header) return null;
  const preferred = header.split(",")[0]?.split("-")[0];
  return availableLocales.includes(preferred as Lang)
    ? (preferred as Lang)
    : null;
}

export default function proxy(request: NextRequest) {
  /*
   * ==============================
   *  AUTH REDIRECT LOGIC
   * ==============================
   */
  const requiresAuth = authenticatedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
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
  /*
   * ==============================
   *    LOCALE REDIRECT LOGIC
   * ==============================
   */
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  // -------------------------
  // Skip all subdomain logic on localhost
  // -------------------------
  if (
    host.startsWith("localhost") ||
    host.startsWith("127.") ||
    host.includes("vercel.app")
  ) {
    return NextResponse.next();
  }

  const subdomain = extractSubdomain(host);
  const cookieLocale = request.cookies.get("locale")?.value as Lang | undefined;
  const browserLocale = detectBrowserLocale(request);

  // Case - Cookie locale
  if (cookieLocale && availableLocales.includes(cookieLocale)) {
    if (subdomain !== cookieLocale) {
      url.hostname = `${cookieLocale}.${stripFirstSubdomain(host)}`;
      return NextResponse.redirect(url, 308);
    } else return NextResponse.next();
  }

  // Case - Subdomain is there
  if (subdomain && availableLocales.includes(subdomain as Lang)) {
    return NextResponse.next();
  }

  // Case - Browser locale
  if (browserLocale) {
    url.hostname = `${browserLocale}.${stripFirstSubdomain(host)}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
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
