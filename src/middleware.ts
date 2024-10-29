import { MiddlewareConfig } from "next/server";
import { auth } from "./lib/auth";

export default auth((req) => {
  const url = req.nextUrl;
  const hasError = url.pathname === "/sign-in" && url.searchParams.has("error");
  if (!req.auth && !hasError && url.pathname !== "/sign-in") {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (
    (req.nextUrl.pathname === "/accounts" ||
      req.nextUrl.pathname === "/services") &&
    req.auth?.user.role !== "ADMIN"
  ) {
    const newUrl = new URL("/forbidden", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|login-bg.jpg|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
