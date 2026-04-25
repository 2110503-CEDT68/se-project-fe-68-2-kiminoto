export default async function uploadProfilePicture(
  token: string,
  file: File
) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    "https://backend-paopaopao.vercel.app";

  // Convert the File to a base64 string
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/png;base64,")
      const base64Only = result.split(",")[1];
      resolve(base64Only);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

  const response = await fetch(`${backendUrl}/api/v1/profile/avatar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      image: base64,
      contentType: file.type,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error ??
      errorData?.message ??
      "Failed to upload profile picture"
    );
  }

  return await response.json();
}