export default async function getVenue(id:string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const response = await fetch(`${backendUrl}/api/v1/car-providers/${id}`)
    if(!response.ok) {
        throw new Error("Failed to fetch provider")
    }
    return await response.json()
}