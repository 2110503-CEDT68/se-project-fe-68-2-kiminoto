"use client";
import { Rating } from "@mui/material";
import UpvoteDownvote from "./UpvoteDownvote";

interface ReviewCardProps {
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  initialScore?: number;
  initialVoteState?: "upvote" | "downvote" | null;
  onVote?: (voteState: "upvote" | "downvote" | null) => void;
  disableVote?: boolean;
}

export default function ReviewCard({
  userName,
  rating,
  comment,
  createdAt,
  initialScore = 0,
  initialVoteState = null,
  onVote,
  disableVote = false,
}: ReviewCardProps) {
  const timeAgo = getRelativeTime(createdAt);

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
          <span className="text-sm font-bold text-foreground tracking-tight">
            {userName}
          </span>
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
