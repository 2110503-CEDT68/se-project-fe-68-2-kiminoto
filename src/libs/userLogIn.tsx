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
        console.error("Login failed:", data);
        throw new Error(typeof data?.message === "string" ? data.message : "Login failed");
    }

    // Extract token from various possible response structures
    const token = data?.token ?? data?.accessToken ?? data?.data?.token ?? data?.data?.accessToken;

    if (!token) {
        throw new Error("No token in login response");
    }

    // Extract user data if available, but don't rely on it being there
    const nested = data?.data ?? {};
    const user = (data?.user || nested?.user || {}) as LoginUser;

    console.log("Login response:", data);

    // Return token - getUserProfile will be called in authorize to fetch full user data
    return {
        user,
        token,
    };
}