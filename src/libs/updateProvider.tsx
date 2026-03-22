type ProviderPayload = {
    name: string;
    address: string;
    tel: string;
};

export default async function updateProvider(providerId: string, payload: ProviderPayload, token: string) {
    const response = await fetch(`https://backend-paopaopao.vercel.app/api/v1/car-providers/${providerId}`, {
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
