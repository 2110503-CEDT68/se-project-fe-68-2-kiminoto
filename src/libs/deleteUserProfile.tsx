export interface DeleteUserProfileFieldBody {
    key: string;
}

export default async function deleteUserProfileField(
    token: string,
    body: DeleteUserProfileFieldBody
) {
    const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ??
        "https://backend-paopaopao.vercel.app";

    const response = await fetch(`${backendUrl}/api/v1/profile/fields`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.error ??
            errorData?.message ??
            "Failed to delete user profile field"
        );
    }

    return await response.json();
}