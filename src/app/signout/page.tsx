"use client";

import { signOut } from "next-auth/react";

export default function SignOutPage() {
  return (
    <main className="min-h-screen bg-background pt-24 px-6 flex items-start justify-center">
      <div className="w-full max-w-md border border-border bg-card-bg p-8 text-center shadow-sm">
        <p className="text-xs tracking-[0.3rem] text-muted mb-2">サイン アウト</p>
        <h1 className="text-3xl font-bold text-foreground mb-2">Sign Out</h1>
        <p className="text-sm text-muted mb-8 tracking-wide">End your current session and return to home.</p>
        <div className="w-10 h-0.5 bg-accent mx-auto mb-8" />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full bg-accent text-white py-3 font-semibold uppercase text-[11px] tracking-[0.25em] hover:opacity-90 transition-all duration-300 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
