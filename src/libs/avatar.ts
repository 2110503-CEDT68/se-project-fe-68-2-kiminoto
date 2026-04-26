const avatarObjectUrlCache = new Map<string, string>();

const PUBLIC_AVATAR_ROUTE_PATTERN =
  /\/api\/v1\/profile\/avatar\/[^/?]+(?:\?|$)/i;

const isPublicAvatarRoute = (url: string) =>
  PUBLIC_AVATAR_ROUTE_PATTERN.test(url);

export async function resolveAvatarSrc(
  pictureUrl?: string,
  token?: string | null
): Promise<string | null> {
  if (!pictureUrl) {
    return null;
  }

  const cacheKey = token ? `${pictureUrl}::${token}` : pictureUrl;
  const cached = avatarObjectUrlCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(pictureUrl, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return isPublicAvatarRoute(pictureUrl) ? pictureUrl : null;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    avatarObjectUrlCache.set(cacheKey, objectUrl);
    return objectUrl;
  } catch {
    return isPublicAvatarRoute(pictureUrl) ? pictureUrl : null;
  }
}
