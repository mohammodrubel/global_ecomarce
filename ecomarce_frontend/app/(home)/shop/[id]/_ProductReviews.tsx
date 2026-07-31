"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  avatar: string;
}

interface ProductReviewsProps {
  reviewsCount: number;
}

export default function ProductReviews({ reviewsCount }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-03-15",
      comment:
        "Absolutely adorable! My daughter looked like a little princess in this dress. The quality is excellent and it's so comfortable for her to wear.",
      verified: true,
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    },
    {
      id: 2,
      name: "Emily Chen",
      rating: 4,
      date: "2024-03-10",
      comment:
        "Beautiful dress and great quality fabric. My baby was comfortable all day. The lace details are so delicate and pretty.",
      verified: true,
      avatar: "/placeholder.svg?height=40&width=40&text=EC",
    },
    {
      id: 3,
      name: "Lisa Martinez",
      rating: 5,
      date: "2024-03-05",
      comment:
        "Perfect for summer parties! The dress is breathable and the fit is just right. Will definitely buy more colors.",
      verified: true,
      avatar: "/placeholder.svg?height=40&width=40&text=LM",
    },
  ]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-primary text-primary"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
          <h3 className="font-semibold text-xl">Customer Reviews</h3>
          <Button>Write a Review</Button>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={review.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold">{review.name}</span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                  <p className="leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
