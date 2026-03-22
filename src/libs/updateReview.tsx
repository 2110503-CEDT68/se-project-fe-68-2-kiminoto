export default async function updateReview(bookingId: string, payload: {rating?: number, comment?: string}, token: string) {
    console.log("[updateReview] START", { bookingId, payload, tokenLength: token?.length });
    
    const response = await fetch(`https://backend-paopaopao.vercel.app/api/v1/bookings/${bookingId}/reviews`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })

    console.log("[updateReview] Response status:", response.status, response.statusText);
    
    const data = await response.json().catch((err) => {
        console.error("[updateReview] JSON parse error:", err);
        return {};
    });

    console.log("[updateReview] Response data:", data);

    if(!response.ok) {
        console.error("[updateReview] Failed:", data);
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to update review")
    }

    console.log("[updateReview] SUCCESS");
    return data
}