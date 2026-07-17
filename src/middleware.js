import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const ADMIN_ONLY_PREFIXES = ["/admin"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 1. not logged in
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { role, tenantID } = token;

  // 2 admin route
  const isAdminRoute = ADMIN_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard") && role !== "admin") {
    const requestedTenant = pathname.split("/")[2]; 
    if (requestedTenant && requestedTenant !== tenantID) {
  return NextResponse.redirect(
        new URL(`/dashboard/${tenantID}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};