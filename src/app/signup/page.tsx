"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField } from "@mui/material";
import Link from "next/link";
import userSignUp from "@/libs/userSignUp";

const fieldSx = { "& .MuiInput-underline:after": { borderBottomColor: "#b42828" } };
const labelStyle = {
  color: "#5a4a3a",
  fontFamily: "Noto Serif JP, serif",
  textTransform: "uppercase" as const,
  letterSpacing: "0.025em",
};
const inputStyle = { color: "#1a1208", fontFamily: "Noto Serif JP, serif" };

export default function SignUpPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await userSignUp({ name, email, password, tel });

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (loginResult?.error) {
        router.push(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      router.push(loginResult?.url || callbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-background px-6 py-20 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3rem] text-muted mb-2">サイン アップ</p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Sign Up</h1>
          <p className="text-sm text-muted tracking-widest">新規登録フォーム</p>
          <div className="w-10 h-0.5 bg-accent mx-auto mt-4" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border border-border p-8 flex flex-col gap-6 shadow-sm"
        >
          <TextField
            variant="standard"
            type="text"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            slotProps={{
              inputLabel: { style: labelStyle },
              input: { style: inputStyle },
            }}
            sx={fieldSx}
          />
          <TextField
            variant="standard"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            slotProps={{
              inputLabel: { style: labelStyle },
              input: { style: inputStyle },
            }}
            sx={fieldSx}
          />
          <TextField
            variant="standard"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            slotProps={{
              inputLabel: { style: labelStyle },
              input: { style: inputStyle },
            }}
            sx={fieldSx}
          />
          <TextField
            variant="standard"
            type="tel"
            label="Telephone"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            required
            slotProps={{
              inputLabel: { style: labelStyle },
              input: { style: inputStyle },
            }}
            sx={fieldSx}
          />

          {error ? <p className="text-xs text-red-700 tracking-wide">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full py-3 bg-accent text-white tracking-widest text-sm font-semibold uppercase hover:opacity-90 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-xs text-muted tracking-wide text-center">
            Already have an account?{" "}
            <Link href="/signin" className="text-accent font-semibold hover:opacity-80">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
