"use client";
import { Rating } from "@mui/material";
import UpvoteDownvote from "./UpvoteDownvote";

interface ReviewCardProps {
    /** User display name */
    userName: string;
    /** Star rating (1–5) */
    rating: number;
    /** Review comment text */
    comment: string;
    /** ISO date string of when the review was created */
    createdAt: string;
    /** Initial upvote/downvote score */
    initialScore?: number;
    /** Called when the user votes */
    onVote?: (voteState: "upvote" | "downvote" | null) => void;
    /** Disable voting (e.g. not logged in) */
    disableVote?: boolean;
}

export default function ReviewCard({
    userName,
    rating,
    comment,
    createdAt,
    initialScore = 0,
    onVote,
    disableVote = false,
}: ReviewCardProps) {
    const timeAgo = getRelativeTime(createdAt);

    return (
        <div className="bg-card-bg border border-border p-6 flex items-start gap-5 group hover:shadow-md transition-shadow duration-300">
            {/* Vote column */}
            <UpvoteDownvote
                initialScore={initialScore}
                onVote={onVote}
                disabled={disableVote}
            />

            {/* Content column */}
            <div className="flex-1 min-w-0">
                {/* Header: name + time */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-sm font-bold text-foreground tracking-tight">
                        {userName}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted/60">
                        •
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted/60" title={new Date(createdAt).toLocaleString()}>
                        {timeAgo}
                    </span>
                </div>

                {/* Star rating */}
                <Rating
                    value={rating}
                    readOnly
                    size="small"
                    sx={{
                        mb: 1,
                        "& .MuiRating-iconFilled": { color: "#b42828" },
                    }}
                />

                {/* Comment body */}
                <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap break-words">
                    {comment}
                </p>
            </div>
        </div>
    );
}

/** Convert an ISO date string to a human-readable relative time (e.g. "3 days ago") */
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
