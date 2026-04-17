export default async function updateBooking(
    bookingId: string,
    bookDate: string,
    token: string,
    isComplete?: boolean,
) {
    const requestBody = {
        bookDate,
        status: isComplete ? "completed" : "active",
        bookingStatus: isComplete ? "completed" : "active",
    };

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const response = await fetch(`${backendUrl}/api/v1/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    })

    const data = await response.json().catch(() => ({}));

    if(!response.ok) {
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to update booking")
    }
    return data
}
