import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/appointments",
  "/customers",
  "/services",
  "/staff",
  "/reports",
  "/settings",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/appointments/:path*",
    "/customers/:path*",
    "/services/:path*",
    "/staff/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};