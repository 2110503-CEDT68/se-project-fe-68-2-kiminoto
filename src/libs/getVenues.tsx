export default async function getVenues() {
    const response = await fetch("https://backend-paopaopao.vercel.app/api/v1/car-providers")
    if(!response.ok) {
        throw new Error("Failed to fetch providers")
    }
    return await response.json()
}