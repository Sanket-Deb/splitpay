import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  //protect routes that require authentication
  if (!isAuthenticated && request.nextUrl.pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //redirect authenticated users away from auth pages
  if (
    isAuthenticated &&
    (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/home/:path*"],
};
