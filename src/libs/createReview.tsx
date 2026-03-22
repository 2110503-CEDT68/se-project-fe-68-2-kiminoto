export default async function createReview(bookingId: string, rating: number, comment: string, token: string) {
    const response = await fetch(`https://backend-paopaopao.vercel.app/api/v1/bookings/${bookingId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            rating,
            comment,
        }),
    })

    const data = await response.json().catch(() => ({}))

    if(!response.ok) {
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to create review")
    }

    return data
}