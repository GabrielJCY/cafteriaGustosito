import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/entrar") {
    return NextResponse.next();
  }

  const sessionToken = process.env.ADMIN_SESSION_TOKEN;
  const adminCookie = request.cookies.get("gustosito_admin")?.value;

  if (!sessionToken || adminCookie !== sessionToken) {
    const loginUrl = new URL("/admin/entrar", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};