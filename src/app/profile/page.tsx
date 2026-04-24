"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import getUserProfile from "@/libs/getUserProfile";
import editUserProfile from "@/libs/editUserProfile";
import deleteUserProfileField from "@/libs/deleteUserProfile";
import SelfProfile from "@/components/Profile";

interface CustomProfileField {
  key: string;
  value: string;
}

interface ProfileData {
  name: string;
  email: string;
  tel: string;
  createdAt: string;
  profile?: {
    fields?: CustomProfileField[];
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!session?.user?.token) return;

    try {
      setIsLoading(true);
      setError(null);

      const profileData = await getUserProfile(session.user.token);
      setProfile(profileData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated" || !session?.user?.token) {
      setIsLoading(false);
      return;
    }

    loadProfile();
  }, [session?.user?.token, status]);

  const handleEditProfileField = async (key: string, value: string) => {
    if (!session?.user?.token) {
      throw new Error("You must be logged in to edit profile");
    }

    const updatedProfile = await editUserProfile(session.user.token, {
      key,
      value,
    });

    setProfile(updatedProfile.data);
  };

  const handleDeleteField = async (key: string) => {
    if (!session?.user?.token) {
      throw new Error("You must be logged in to delete profile field");
    }

    const updatedProfile = await deleteUserProfileField(session.user.token, {
      key,
    });

    setProfile(updatedProfile.data);
  };

  if (status === "unauthenticated") {
    return (
      <main className="bg-background min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Please log in to view your profile
            </h1>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <p className="text-muted text-lg">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-background min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <p className="text-accent text-lg font-semibold">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3rem] text-muted mb-2">
            ユーザー
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            My Account
          </h1>
          <p className="text-sm text-muted tracking-widest mt-2">
            Manage your profile information
          </p>
          <div className="w-10 h-0.5 bg-accent mt-4" />
        </div>

        {profile && (
          <SelfProfile
            profile={profile}
            onEditProfileField={handleEditProfileField}
            onDeleteField={handleDeleteField}
          />
        )}
      </div>
    </main>
  );
}