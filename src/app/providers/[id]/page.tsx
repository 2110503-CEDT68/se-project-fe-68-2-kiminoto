"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "@mui/material";
import getVenue from "@/libs/getVenue";
import ReviewCard from "@/components/ReviewCard";

interface Review {
  _id: string;
  user?: { name?: string; email?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Provider {
  _id: string;
  name: string;
  address: string;
  tel: string;
  avgRating?: number;
  bookings?: Array<{
    _id: string;
    review?: Review;
    reviews?: Review[];
    user?: { name?: string; email?: string };
  }>;
}

const providerImages = [
  "/img/img1.jpg",
  "/img/img2.jpg",
  "/img/img3.jpg",
  "/img/img4.jpg",
  "/img/img5.jpg",
];

export default function ProviderReviewsPage() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getVenue(id);
        const providerData: Provider = data?.data ?? data;
        setProvider(providerData);

        // Extract reviews from bookings
        const extracted: Review[] = [];
        const bookings = providerData?.bookings ?? [];
        for (const booking of bookings) {
          const review = booking.review ?? (booking.reviews && booking.reviews[0]);
          if (review) {
            extracted.push({
              ...review,
              user: review.user ?? booking.user,
            });
          }
        }
        // Sort newest first
        extracted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(extracted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load provider");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const coverImage = providerImages[Math.abs(hashCode(id ?? "")) % providerImages.length];

  return (
    <main className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative pt-24 pb-20 px-6 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-3 blur-xs">
            <Image
              src={coverImage}
              alt={provider?.name ?? "Provider banner"}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-foreground/75" />
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.3rem] text-[#f0e6d7] mb-2">
              レビュー
            </p>
            <h1 className="text-4xl md:text-6xl text-white tracking-tight mb-4 leading-none font-bold">
              {isLoading ? "Loading…" : (provider?.name ?? "Reviews")}
            </h1>
            <p className="text-[#f0e6d7] text-[10px] uppercase tracking-[0.35em]">
              Customer Reviews &amp; Ratings
            </p>
            <div className="w-10 h-0.5 bg-accent mt-4" />
          </div>
          <Link
            href="/providers"
            className="relative z-10 border border-white/30 text-white text-[10px] uppercase tracking-[0.3em] px-5 py-3 hover:bg-white/10 transition-all"
          >
            ← All Providers
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-10 pb-24">
        {/* Provider info card */}
        <div className="z-20 relative bg-card-bg border border-border shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {isLoading ? (
            <p className="text-muted text-sm uppercase tracking-wider">Loading provider…</p>
          ) : error ? (
            <p className="text-accent text-xs font-bold uppercase tracking-wider">{error}</p>
          ) : provider ? (
            <>
              <div className="space-y-1">
                <p className="text-[9px] uppercase tracking-[0.25em] text-muted font-semibold">
                  ID: {provider._id}
                </p>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  {provider.name}
                </h2>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-sm text-foreground/80">🖈 {provider.address}</p>
                  <p className="text-sm text-foreground/80">☎ {provider.tel}</p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-1">
                <p className="text-[9px] uppercase tracking-[0.25em] text-muted font-semibold">
                  Average Rating
                </p>
                {provider.avgRating ? (
                  <>
                    <p className="text-4xl font-bold text-foreground">
                      {provider.avgRating.toFixed(1)}
                    </p>
                    <Rating
                      value={provider.avgRating}
                      readOnly
                      precision={0.1}
                      sx={{ "& .MuiRating-iconFilled": { color: "#b42828" } }}
                    />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold text-muted">No ratings yet</p>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Reviews section */}
        <div className="mb-6 flex items-center gap-4">
          <h3 className="text-xs uppercase tracking-[0.3em] text-muted font-semibold">
            Customer Reviews
          </h3>
          <div className="flex-1 h-px bg-border" />
          {!isLoading && !error && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="bg-card-bg border border-border p-12 flex items-center justify-center">
            <p className="text-muted text-2xl">Loading reviews…</p>
          </div>
        ) : error ? (
          <div className="bg-card-bg border border-border p-6">
            <p className="text-accent text-xs font-bold uppercase tracking-wider">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-card-bg border border-border p-12 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-4xl text-muted/30">★</p>
            <p className="text-sm text-muted uppercase tracking-[0.2em]">No reviews yet</p>
            <p className="text-xs text-muted/60 max-w-xs">
              Complete a booking with this provider and share your experience.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review, index) => (
              <ReviewCard
                key={review._id ?? index}
                userName={
                  review.user?.name ||
                  review.user?.email ||
                  "Anonymous"
                }
                rating={review.rating}
                comment={review.comment}
                createdAt={review.createdAt}
                disableVote={true}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
