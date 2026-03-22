export default async function createBooking(carProviderId: string, bookDate: string, token: string) {
    const response = await fetch(`https://backend-paopaopao.vercel.app/api/v1/car-providers/${carProviderId}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            bookDate,
        }),
    })

    const data = await response.json().catch(() => ({}))

    if(!response.ok) {
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to create booking")
    }

    return data
}
