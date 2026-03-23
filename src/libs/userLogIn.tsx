type LoginUser = {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
};

type LoginResult = {
    user: LoginUser;
    token: string;
};

export default async function UserLogin(userEmail: string, userPassword: string): Promise<LoginResult> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://backend-paopaopao.vercel.app";
    const response = await fetch(`${backendUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            email: userEmail.trim(),
            password: userPassword,
        }),
        cache: "no-store",
    });

    const data = await response.json().catch(() => ({} as any));

    if (!response.ok) {
        throw new Error(typeof data?.message === "string" ? data.message : "Login failed");
    }

    const token = data?.token ?? data?.accessToken ?? data?.data?.token ?? data?.data?.accessToken;

    if (!token) {
        throw new Error("No token in login response");
    }

    const nested = data?.data ?? {};
    const user = (data?.user || nested?.user || {}) as LoginUser;

    return {
        user,
        token,
    };
}