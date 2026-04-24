export interface EditUserProfileBody {
    key: string;
    value: string;
}

export default async function editUserProfile(
    token: string,
    body: EditUserProfileBody
) {
    const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ??
        "https://backend-paopaopao.vercel.app";

    const response = await fetch(`${backendUrl}/api/v1/profile/fields`, {
        method: "PATCH",
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
            "Failed to edit user profile field"
        );
    }

    return await response.json();
}