/**
 * Get a the value of a cookie given the key.
 *
 * @param key the key of the cookie (i.e. 'token')
 * @returns cookie value
 */
export function indexCookie(key: string): string | null {
  return document.cookie
    .split('; ')
    ?.find(row => row.startsWith(`${key}=`))
    ?.split('=')[1];
}
