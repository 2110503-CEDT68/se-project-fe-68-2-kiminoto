export default async function getProviderReviews(
    providerId: string,
    token?: string | null
) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const headers: HeadersInit = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${backendUrl}/api/v1/car-providers/${providerId}/reviews`,
        {
            method: "GET",
            cache: "no-store",
            headers,
        }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(
            typeof data?.message === "string"
                ? data.message
                : "Failed to fetch provider reviews"
        )
    }

    return data
}