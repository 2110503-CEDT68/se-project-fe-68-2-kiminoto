import { BACKEND_URL } from "./config";

export default async function getUserProfile(token: string) {
    const backendUrl = BACKEND_URL;

    const response = await fetch(`${backendUrl}/api/v1/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }

    return await response.json();
}