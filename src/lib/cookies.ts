export function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; max-age=${maxAgeSeconds}; path=/; samesite=lax`;
}

export const RSVP_CODE_COOKIE = "rsvp_code";
