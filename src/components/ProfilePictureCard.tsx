"use client";
import { useState, useEffect } from "react";

interface ProfilePictureCardProps {
  picture?: string;
  token?: string;
  name?: string;
  email?: string;
}

export default function ProfilePictureCard({
  picture,
  token,
  name,
  email,
}: ProfilePictureCardProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!picture || !token) return;

    let objectUrl: string | null = null;

    const fetchAvatar = async () => {
      try {
        const res = await fetch(picture, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!res.ok) {
          setImgSrc(null);
          return;
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setImgSrc(objectUrl);
      } catch {
        setImgSrc(null);
      }
    };

    fetchAvatar();

    // Cleanup blob URL when component unmounts or picture/token changes
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [picture, token]);

  const getInitials = (fullName: string | undefined) => {
    if (!fullName) return "?";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-card-bg border border-border shadow-sm p-6 text-center w-full">
      <div className="flex justify-center mb-4">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name || "Profile picture"}
            className="w-40 h-40 rounded-full object-cover border-2 border-border shadow-sm"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-foreground flex items-center justify-center border-2 border-border shadow-sm">
            <span className="text-4xl font-bold text-card-bg">
              {getInitials(name)}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {name && (
          <h2 className="text-2xl font-bold text-foreground">{name}</h2>
        )}
        {email && <p className="text-muted">{email}</p>}
      </div>
    </div>
  );
}