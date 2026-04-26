import { VenueJson } from "@/interface";

let cachedVenues: Promise<VenueJson> | null = null;

export default function getVenues() {
    if (!cachedVenues) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
        cachedVenues = fetch(`${backendUrl}/api/v1/car-providers`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch providers")
                }
                return response.json()
            })
            .catch((error) => {
                cachedVenues = null;
                throw error;
            });
    }

    return cachedVenues;
}