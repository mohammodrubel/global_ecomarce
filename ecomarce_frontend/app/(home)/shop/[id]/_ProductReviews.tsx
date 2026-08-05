import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ReviewUser {
  id: string;
  full_name: string;
  profile_photo?: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: ReviewUser;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewsCount: number;
}

function renderStars(rating: number, size = "h-4 w-4") {
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`${size} ${
        i < Math.round(rating)
          ? "fill-amber-400 text-amber-400"
          : "text-slate-300"
      }`}
    />
  ));
}

export default function ProductReviews({
  reviews,
  averageRating,
  reviewsCount,
}: ProductReviewsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
          <div>
            <h3 className="font-semibold text-xl mb-1">Customer Reviews</h3>
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-sm text-slate-700 font-medium">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500">
                ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-500">
            No reviews yet. Be the first to review after your order is delivered.
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => {
              const initials = review.user?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "?";
              return (
                <div
                  key={review.id}
                  className="border-b pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border">
                      {review.user?.profile_photo && (
                        <AvatarImage
                          src={review.user.profile_photo}
                          alt={review.user.full_name}
                        />
                      )}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-semibold">
                          {review.user?.full_name || "Anonymous"}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="leading-relaxed text-sm text-slate-700">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
