import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const paletteCookie = request.cookies.get("palette");
  const themeCookie = request.cookies.get("theme");

  const hour = new Date().getHours();
  const palette = paletteCookie?.value ?? (
    hour >= 6 && hour < 12 ? "dawn"
    : hour >= 12 && hour < 18 ? "day"
    : hour >= 18 && hour < 22 ? "dusk"
    : "midnight"
  );

  const theme = themeCookie?.value ?? "terminal";

  const response = NextResponse.next();
  response.headers.set("x-palette", palette);
  response.headers.set("x-theme", theme);
  return response;
}

export const config = {
  matcher: "/((?!_next/static|favicon.ico).*)",
};
