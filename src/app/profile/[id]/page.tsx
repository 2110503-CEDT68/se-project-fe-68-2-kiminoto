"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import SelfProfile, { ProfileData } from "@/components/Profile";
import { BACKEND_URL } from "@/libs/config";

function PublicProfileContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const userId = params.id;
  const name = searchParams.get("name") || "Anonymous";
  const email = searchParams.get("email") || "";

  const backendUrl = BACKEND_URL;

  const profile: ProfileData = {
    name,
    email,
    tel: "-",
    createdAt: new Date().toISOString(),
    picture: `${backendUrl}/api/v1/profile/avatar/${userId}`,
    profile: { fields: [] },
  };

  return (
    <main className="bg-background min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3rem] text-muted mb-2">
            Public Profile
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            {name}
          </h1>
          <p className="text-sm text-muted tracking-widest mt-2">
            User profile visible to everyone
          </p>
          <div className="w-10 h-0.5 bg-accent mt-4" />
        </div>

        <SelfProfile
          profile={profile}
          token={session?.user?.token}
          readOnly
          onEditProfileField={async () => {}}
          onDeleteField={async () => {}}
        />
      </div>
    </main>
  );
}

export default function PublicProfilePage() {
  return (
    <Suspense>
      <PublicProfileContent />
    </Suspense>
  );
}