let rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
if (rawUrl && !rawUrl.startsWith("http")) {
  rawUrl = `https://${rawUrl}`;
}
export const BACKEND_URL = rawUrl.replace(/\/$/, ""); // Remove trailing slash if present

export const getBackendUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_URL}${normalizedPath}`;
};
