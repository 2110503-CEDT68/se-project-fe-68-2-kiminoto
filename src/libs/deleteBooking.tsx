export default async function deleteBooking(bookingId: string, token: string) {
    const response = await fetch(`https://backend-paopaopao.vercel.app/api/v1/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await response.json().catch(() => ({}))

    if(!response.ok) {
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to delete booking")
    }

    return data
}
