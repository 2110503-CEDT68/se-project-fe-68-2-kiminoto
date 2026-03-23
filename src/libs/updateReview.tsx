export default async function updateReview(bookingId: string, payload: {rating?: number, comment?: string}, token: string) {
    const response = await fetch(`https://backend-paopaopao.vercel.app/api/v1/bookings/${bookingId}/reviews`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}));

    if(!response.ok) {
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to update review")
    }
    return data
}