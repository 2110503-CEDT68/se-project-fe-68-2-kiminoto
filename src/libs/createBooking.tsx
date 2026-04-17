export default async function createBooking(carProviderId: string, bookDate: string, token: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const response = await fetch(`${backendUrl}/api/v1/car-providers/${carProviderId}/bookings`, {
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
