export interface VenueItem {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  picture: string;
  dailyrate: number;
  __v: number;
  id: string;
}

export interface VenueJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: VenueItem[];
}

export type VoteState = "upvote" | "downvote" | null;

export interface Review {
  _id: string;
  user?: { name?: string; email?: string };
  rating: number;
  comment: string;
  createdAt: string;
  score: number;
  voteState: VoteState;
}

export interface ProviderReviewApiItem {
  _id: string;
  user?: { _id?: string; name?: string; email?: string };
  review?: {
    rating?: number;
    comment?: string;
    createdAt?: string;
  };
  voteSummary?: {
    upvoteCount?: number;
    downvoteCount?: number;
    userVote?: "upvote" | "downvote" | null;
  };
}

export interface Provider {
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