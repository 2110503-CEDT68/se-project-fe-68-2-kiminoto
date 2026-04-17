export default async function getVenues() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const response = await fetch(`${backendUrl}/api/v1/car-providers`)
    if(!response.ok) {
        throw new Error("Failed to fetch providers")
    }
    return await response.json()
}