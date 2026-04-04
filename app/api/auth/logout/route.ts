export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

function clearCookieAndRedirect() {
  const response = NextResponse.redirect(
    new URL("/login", process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000")
  );
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET() {
  return clearCookieAndRedirect();
}

export async function POST() {
  return clearCookieAndRedirect();
}
