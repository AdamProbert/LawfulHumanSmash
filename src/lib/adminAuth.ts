import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_session";

/** True if the request carries a cookie matching the shared admin password. */
export function isAdmin(request: NextRequest): boolean {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  return !!session && session === process.env.ADMIN_PASSWORD;
}
