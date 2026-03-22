export default async function getVenue(id:string) {
    const response = await fetch(`https://backend-paopaopao.vercel.app/api/v1/car-providers/${id}`)
    if(!response.ok) {
        throw new Error("Failed to fetch provider")
    }
    return await response.json()
}