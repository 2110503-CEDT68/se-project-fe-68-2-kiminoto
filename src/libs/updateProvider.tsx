type ProviderPayload = {
    name: string;
    address: string;
    tel: string;
};

export default async function updateProvider(providerId: string, payload: ProviderPayload, token: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const response = await fetch(`${backendUrl}/api/v1/car-providers/${providerId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to update provider");
    }

    return data;
}
