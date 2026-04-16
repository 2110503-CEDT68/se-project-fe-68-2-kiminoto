export default async function getProviderReviews(providerId: string) {
    const response = await fetch(
        `https://backend-paopaopao.vercel.app/api/v1/car-providers/${providerId}/reviews`,
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