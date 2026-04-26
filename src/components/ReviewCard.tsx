"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Rating } from "@mui/material";
import UpvoteDownvote from "./UpvoteDownvote";

import { BACKEND_URL } from "@/libs/config";
const avatarCache = new Map<string, string>();

interface ReviewCardProps {
  userId?: string;
  token?: string;
  userName: string;
  userEmail?: string;
  userPicture?: string;
  rating: number;
  comment: string;
  createdAt: string;
  initialScore?: number;
  initialVoteState?: "upvote" | "downvote" | null;
  onVote?: (voteState: "upvote" | "downvote" | null) => void;
  disableVote?: boolean;
}

export default function ReviewCard({
  userId,
  token,
  userName,
  userEmail,
  userPicture,
  rating,
  comment,
  createdAt,
  initialScore = 0,
  initialVoteState = null,
  onVote,
  disableVote = false,
}: ReviewCardProps) {
  const timeAgo = getRelativeTime(createdAt);
  const [resolvedPicture, setResolvedPicture] = useState<string | null>(null);

  useEffect(() => {
    const pictureUrl =
      userPicture || (userId ? `${BACKEND_URL}/api/v1/profile/avatar/${userId}` : "");

    if (!pictureUrl || !token) {
      setResolvedPicture(null);
      return;
    }

    const cacheKey = `${pictureUrl}::${token}`;
    const cached = avatarCache.get(cacheKey);
    if (cached) {
      setResolvedPicture(cached);
      return;
    }

    let objectUrl: string | null = null;

    const fetchAvatar = async () => {
      try {
        const res = await fetch(pictureUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setResolvedPicture(pictureUrl);
          return;
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        avatarCache.set(cacheKey, objectUrl);
        setResolvedPicture(objectUrl);
      } catch {
        setResolvedPicture(pictureUrl);
      }
    };

    fetchAvatar();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [token, userId, userPicture]);

  const profileHref = userId
    ? {
        pathname: `/profile/${userId}`,
        query: {
          name: userName,
          email: userEmail ?? "",
        },
      }
    : null;

  return (
    <div className="bg-card-bg border border-border p-6 flex items-start gap-5 group hover:shadow-md transition-shadow duration-300">
      <UpvoteDownvote
        initialScore={initialScore}
        initialVoteState={initialVoteState}
        onVote={onVote}
        disabled={disableVote}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-border bg-[#f5efe6] flex items-center justify-center shrink-0">
            {resolvedPicture ? (
              <img
                src={resolvedPicture}
                alt={userName}
                className="w-full h-full object-cover"
                onError={() => setResolvedPicture(null)}
              />
            ) : (
              <span className="text-xs font-bold text-foreground tracking-[0.15em]">
                {getInitials(userName)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            {profileHref ? (
              <Link
                href={profileHref}
                className="text-sm font-bold text-foreground tracking-tight hover:text-accent transition-colors"
              >
                {userName}
              </Link>
            ) : (
              <span className="text-sm font-bold text-foreground tracking-tight">
                {userName}
              </span>
            )}

            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted/60">
                •
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.2em] text-muted/60"
                title={new Date(createdAt).toLocaleString()}
              >
                {timeAgo}
              </span>
            </div>
          </div>
        </div>

        <Rating
          value={rating}
          readOnly
          size="small"
          sx={{
            mb: 1,
            "& .MuiRating-iconFilled": { color: "#b42828" },
          }}
        />

        <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap wrap-break-word">
          {comment}
        </p>
      </div>
    </div>
  );
}

function getInitials(fullName: string | undefined): string {
  if (!fullName) return "?";

  return fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}
