"use client";

import React, { useEffect, useState, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField } from "@mui/material";
import Link from "next/link";

const fieldSx = { '& .MuiInput-underline:after': { borderBottomColor: '#b42828' } };
const labelStyle = { color: '#5a4a3a', fontFamily: 'Noto Serif JP, serif', textTransform: 'uppercase' as const, letterSpacing: '0.025em' };
const inputStyle = { color: '#1a1208', fontFamily: 'Noto Serif JP, serif' };

function SignInContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(result?.url || callbackUrl);
  };

  return (
    <main className="bg-background px-6 py-20 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3rem] text-muted mb-2">ログ イン</p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Login</h1>
          <p className="text-sm text-muted tracking-widest">ログインフォーム</p>
          <div className="w-10 h-0.5 bg-accent mx-auto mt-4" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border border-border p-8 flex flex-col gap-6 shadow-sm"
        >
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

          {error ? (
            <p className="text-xs text-red-700 tracking-wide">{error}</p>
          ) : null}

          <button
            type="submit"
            className="mt-2 w-full py-3 bg-accent text-white tracking-widest text-sm font-semibold uppercase hover:opacity-90 transition-all duration-200 cursor-pointer"
          >
            Log In
          </button>

          <p className="text-xs text-muted tracking-wide text-center">
            Need an account?{" "}
            <Link href="/signup" className="text-accent font-semibold hover:opacity-80">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}