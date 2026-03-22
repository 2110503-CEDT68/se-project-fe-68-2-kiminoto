export default async function updateBooking(
    bookingId: string,
    bookDate: string,
    token: string,
    isComplete?: boolean,
) {
    console.log("[updateBooking] START", { bookingId, bookDate, isComplete, tokenLength: token?.length });
    
    const requestBody = {
        bookDate,
        status: isComplete ? "completed" : "active",
        bookingStatus: isComplete ? "completed" : "active",
    };
    console.log("[updateBooking] Request body:", requestBody);
    
    const response = await fetch(`https://backend-paopaopao.vercel.app/api/v1/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    })

    console.log("[updateBooking] Response status:", response.status, response.statusText);
    
    const data = await response.json().catch((err) => {
        console.error("[updateBooking] JSON parse error:", err);
        return {};
    });

    console.log("[updateBooking] Response data:", data);

    if(!response.ok) {
        console.error("[updateBooking] Failed:", data);
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to update booking")
    }

    console.log("[updateBooking] SUCCESS");
    return data
}
