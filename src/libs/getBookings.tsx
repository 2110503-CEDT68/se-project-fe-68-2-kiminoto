export default async function getBookings(token: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const response = await fetch(`${backendUrl}/api/v1/bookings`, {
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
