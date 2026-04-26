"use client";

import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SelfProfile, { ProfileData } from "@/components/Profile";
import { BACKEND_URL } from "@/libs/config";

function PublicProfileContent() {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const userId = params.id;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        setError("");
        const response = await fetch(`${BACKEND_URL}/api/v1/profile/${userId}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load profile");
        }

        setProfile({
          ...data.data,
          picture: `${BACKEND_URL}/api/v1/profile/avatar/${userId}`,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      }
    };

    void loadProfile();
  }, [userId]);

  return (
    <main className="bg-background min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3rem] text-muted mb-2">
            Public Profile
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            {profile?.name ?? "Loading..."}
          </h1>
          <p className="text-sm text-muted tracking-widest mt-2">
            User profile visible to everyone
          </p>
          <div className="w-10 h-0.5 bg-accent mt-4" />
        </div>

        {error ? (
          <div className="bg-card-bg border border-border p-6">
            <p className="text-accent text-sm">{error}</p>
          </div>
        ) : profile ? (
          <SelfProfile
            profile={profile}
            token={session?.user?.token}
            readOnly
            onEditProfileField={async () => {}}
            onDeleteField={async () => {}}
          />
        ) : (
          <div className="bg-card-bg border border-border p-6">
            <p className="text-muted text-sm">Loading profile...</p>
          </div>
        )}
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
