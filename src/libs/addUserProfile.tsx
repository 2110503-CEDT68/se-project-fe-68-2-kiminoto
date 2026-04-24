export interface CustomProfileField {
    key: string;
    value: string;
}

export interface AddUserProfileBody {
    fields: CustomProfileField[];
}

export default async function addUserProfile(
    token: string,
    body: AddUserProfileBody
) {
    const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ??
        "https://backend-paopaopao.vercel.app";

    const response = await fetch(`${backendUrl}/api/v1/auth/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? "Failed to add user profile");
    }

    return await response.json();
}