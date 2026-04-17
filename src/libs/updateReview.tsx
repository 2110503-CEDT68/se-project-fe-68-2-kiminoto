export default async function updateReview(bookingId: string, payload: {rating?: number, comment?: string}, token: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const response = await fetch(`${backendUrl}/api/v1/bookings/${bookingId}/reviews`, {
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