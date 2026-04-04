export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

function clearCookieAndRedirect(request: NextRequest) {
  const url = new URL("/login", request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET(request: NextRequest) {
  return clearCookieAndRedirect(request);
}

export async function POST(request: NextRequest) {
  return clearCookieAndRedirect(request);
}
