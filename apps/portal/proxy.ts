import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/bookings",
  "/notifications",
  "/settings",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "callbackUrl",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/bookings/:path*",
    "/notifications/:path*",
    "/settings/:path*",
  ],
};