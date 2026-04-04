export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

function clearCookieAndRedirect(request: NextRequest) {
  const url = new URL("/login", request.url);
  const response = NextResponse.redirect(url);

  // Clear all auth cookies
  const cookieOptions = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 0 };
  response.cookies.set("auth_token_super", "", cookieOptions);
  response.cookies.set("auth_token_shop", "", cookieOptions);
  response.cookies.set("auth_token", "", cookieOptions);

  return response;
}

export async function GET(request: NextRequest) {
  return clearCookieAndRedirect(request);
}

export async function POST(request: NextRequest) {
  return clearCookieAndRedirect(request);
}
