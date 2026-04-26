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
  pagination: object;
  data: VenueItem[];
}

export type VoteState = "upvote" | "downvote" | null;

export interface ReviewUser {
  _id?: string;
  name?: string;
  email?: string;
  picture?: string;
  profilePicture?: string;
  avatar?: string;
  profile?: {
    fields?: Array<{
      key?: string;
      value?: string;
    }>;
  };
}

export interface Review {
  _id: string;
  user?: ReviewUser;
  rating: number;
  comment: string;
  createdAt: string;
  score: number;
  voteState: VoteState;
}

export interface ProviderReviewApiItem {
  _id: string;
  user?: ReviewUser;
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