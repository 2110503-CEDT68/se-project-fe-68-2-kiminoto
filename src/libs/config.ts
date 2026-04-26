export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app"
).replace(/\/$/, ""); // Remove trailing slash if present

export const getBackendUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_URL}${normalizedPath}`;
};
