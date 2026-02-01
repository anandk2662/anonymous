import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (
    token &&
    (pathname === "/signin" ||
      pathname === "/signup" ||
      pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/verify/:path*",
    "/dashboard/:path*",
  ],
};
