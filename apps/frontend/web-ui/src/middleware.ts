import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_PATHS = ["/auth/login", "/auth/signup"];
const PROTECTED_PATHS = ["/dashboard"];

export async function middleware(req: NextRequest) {
  // Get the token from the request to see if the user is logged in.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // If the user is authenticated and tries to access an auth page
  // redirect them to the dashboard.
  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (isAuthPage) {
    if (token) {
      // User is authenticated, redirect to the dashboard.
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // If not authenticated, allow access to the auth page.
    return NextResponse.next();
  }

  // If the user tries to access a protected page
  // and is not authenticated, redirect them to the login page.
  const isProtectedPage = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPage && !token) {
    // User is not authenticated, redirect to the login page.
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For all other cases, proceed with the request.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api
     * - _next/static 
     * - _next/image
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
