export default async function getBookings(token: string) {
    const response = await fetch("https://backend-paopaopao.vercel.app/api/v1/bookings", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    })

    const data = await response.json().catch(() => ({}))

    if(!response.ok) {
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to fetch bookings")
    }

    return data
}
