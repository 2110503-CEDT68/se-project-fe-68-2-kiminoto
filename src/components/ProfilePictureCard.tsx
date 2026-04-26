"use client";
import { useState, useEffect } from "react";

const avatarCache = new Map<string, string>();

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
    if (!picture) {
      setImgSrc(null);
      return;
    }

    if (!token) {
      setImgSrc(null);
      return;
    }

    const cacheKey = `${picture}::${token}`;
    const cached = avatarCache.get(cacheKey);
    if (cached) {
      setImgSrc(cached);
      return;
    }

    let objectUrl: string | null = null;

    const fetchAvatar = async () => {
      try {
        const res = await fetch(picture, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // If 401/403, maybe the token is invalid or not needed.
          // Try using the URL directly in the img tag as a fallback.
          setImgSrc(picture);
          return;
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        avatarCache.set(cacheKey, objectUrl);
        setImgSrc(objectUrl);
      } catch (error) {
        // This catch block handles "NetworkError" (CORS or server down).
        // If it's a CORS issue with the Authorization header, 
        // using the URL directly might still work if the image is public.
        setImgSrc(picture);
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
            onError={() => setImgSrc(null)}
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