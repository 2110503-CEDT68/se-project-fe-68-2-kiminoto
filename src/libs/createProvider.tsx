type ProviderPayload = {
    name: string;
    address: string;
    tel: string;
};

export default async function createProvider(payload: ProviderPayload, token: string) {
    const response = await fetch("https://backend-paopaopao.vercel.app/api/v1/car-providers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(typeof data?.message === "string" ? data.message : "Failed to create provider");
    }

    return data;
}
