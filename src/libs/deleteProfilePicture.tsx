import { BACKEND_URL } from "./config";

export default async function deleteProfilePicture(token: string) {
  const response = await fetch(`${BACKEND_URL}/api/v1/profile/avatar`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error ??
        errorData?.message ??
        "Failed to delete profile picture"
    );
  }

  return await response.json();
}
