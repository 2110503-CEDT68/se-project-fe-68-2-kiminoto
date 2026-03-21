export default async function UserLogin(userEmail:string, userPassword:string) {
    const response = await fetch("https://a08-venue-explorer-backend-3.vercel.app/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email:userEmail,
            password: userPassword,
        }),
    })

    if(!response.ok) {
        throw new Error("Failed to fetch venues")
    }
    return await response.json()
}