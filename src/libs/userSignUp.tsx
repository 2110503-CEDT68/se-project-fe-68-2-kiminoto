type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  tel: string;
};

export default async function userSignUp(payload: SignUpPayload) {
  const response = await fetch("https://backend-paopaopao.vercel.app/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.message === "string" ? data.message : "Sign up failed.";
    throw new Error(message);
  }

  return data;
}
