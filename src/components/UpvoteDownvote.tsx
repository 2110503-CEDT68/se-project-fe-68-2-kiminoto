"use client";
import { useState, useCallback, useEffect, useRef } from "react";

type VoteState = "upvote" | "downvote" | null;

interface UpvoteDownvoteProps {
    /** Initial vote count */
    initialScore?: number;
    /** Current user's vote state */
    initialVoteState?: VoteState;
    /** Called when the user votes. Receives the new vote state. */
    onVote?: (voteState: VoteState) => void;
    /** Disable interaction (e.g. if user is not logged in) */
    disabled?: boolean;
}

export default function UpvoteDownvote({
    initialScore = 0,
    initialVoteState = null,
    onVote,
    disabled = false,
}: UpvoteDownvoteProps) {
    const [voteState, setVoteState] = useState<VoteState>(initialVoteState);
    const [score, setScore] = useState(initialScore);
    const [isAnimating, setIsAnimating] = useState<"up" | "down" | null>(null);
    const clickLockRef = useRef(false);

    useEffect(() => {
        setVoteState(initialVoteState);
    }, [initialVoteState]);

    useEffect(() => {
        setScore(initialScore);
    }, [initialScore]);

    useEffect(() => {
        if (!disabled) {
            clickLockRef.current = false;
        }
    }, [disabled, initialScore, initialVoteState]);

    const handleVote = useCallback(
        (type: "upvote" | "downvote") => {
            if (disabled || clickLockRef.current) return;
            clickLockRef.current = true;

            let newVoteState: VoteState;
            let scoreDelta: number;

            if (voteState === type) {
                newVoteState = null;
                scoreDelta = type === "upvote" ? -1 : 1;
            } else if (voteState === null) {
                newVoteState = type;
                scoreDelta = type === "upvote" ? 1 : -1;
            } else {
                newVoteState = type;
                scoreDelta = type === "upvote" ? 2 : -2;
            }

            setVoteState(newVoteState);
            setScore((prev) => prev + scoreDelta);
            setIsAnimating(type === "upvote" ? "up" : "down");
            setTimeout(() => setIsAnimating(null), 300);

            onVote?.(newVoteState);
        },
        [voteState, disabled, onVote]
    );

    const scoreColor =
        voteState === "upvote"
            ? "text-[#b42828]"
            : voteState === "downvote"
            ? "text-[#4a6fa5]"
            : "text-foreground";

    return (
        <div
            className="flex flex-col items-center gap-1 select-none"
            role="group"
            aria-label="Vote"
        >
            {/* Upvote Button */}
            <button
                type="button"
                onClick={() => handleVote("upvote")}
                disabled={disabled}
                aria-label="Upvote"
                aria-pressed={voteState === "upvote"}
                className={`
                    p-1.5 rounded-sm
                    transition-all duration-200 ease-out
                    ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    ${
                        voteState === "upvote"
                            ? "bg-[#b42828]/10 text-[#b42828]"
                            : "text-muted hover:bg-[#b42828]/5 hover:text-[#b42828]"
                    }
                    ${isAnimating === "up" ? "scale-125" : "scale-100"}
                    active:scale-90
                `}
                style={{ lineHeight: 0 }}
            >
                <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill={voteState === "upvote" ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={voteState === "upvote" ? 0 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-200"
                >
                    <path d="M12 4 L3 15 L8 15 L8 20 L16 20 L16 15 L21 15 Z" />
                </svg>
            </button>

            {/* Score */}
            <span
                className={`
                    text-sm font-bold tracking-tight
                    ${scoreColor}
                    transition-colors duration-200
                    min-w-[1.5em] text-center
                    tabular-nums
                `}
                aria-live="polite"
                aria-label={`Score: ${score}`}
            >
                {formatScore(score)}
            </span>

            {/* Downvote Button */}
            <button
                type="button"
                onClick={() => handleVote("downvote")}
                disabled={disabled}
                aria-label="Downvote"
                aria-pressed={voteState === "downvote"}
                className={`
                    p-1.5 rounded-sm
                    transition-all duration-200 ease-out
                    ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    ${
                        voteState === "downvote"
                            ? "bg-[#4a6fa5]/10 text-[#4a6fa5]"
                            : "text-muted hover:bg-[#4a6fa5]/5 hover:text-[#4a6fa5]"
                    }
                    ${isAnimating === "down" ? "scale-125" : "scale-100"}
                    active:scale-90
                `}
                style={{ lineHeight: 0 }}
            >
                <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill={voteState === "downvote" ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={voteState === "downvote" ? 0 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-200"
                >
                    <path d="M12 20 L3 9 L8 9 L8 4 L16 4 L16 9 L21 9 Z" />
                </svg>
            </button>
        </div>
    );
}

/** Format large scores like Reddit (e.g. 1.2k) */
function formatScore(score: number): string {
    if (Math.abs(score) >= 10_000) {
        return `${(score / 1000).toFixed(0)}k`;
    }
    if (Math.abs(score) >= 1_000) {
        return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toString();
}
