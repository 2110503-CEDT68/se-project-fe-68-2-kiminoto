export default async function getProviderReviews(providerId: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const response = await fetch(
        `${backendUrl}/api/v1/car-providers/${providerId}/reviews`,
        {
            method: "GET",
            cache: "no-store",
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