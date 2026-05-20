import React from "react";
import { Star, StarHalf } from "lucide-react";

export default function StarRating({
  rating = 0,
  size = 16,
  showValue = false,
}) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyFrom = fullStars + (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return (
            <Star
              key={i}
              size={size}
              className="text-yellow-400 fill-yellow-400"
            />
          );
        }
        if (i === fullStars && hasHalf) {
          return (
            <div
              key={i}
              className="relative"
              style={{ width: size, height: size }}
            >
              <Star size={size} className="text-gray-300 absolute inset-0" />
              <StarHalf
                size={size}
                className="text-yellow-400 fill-yellow-400 absolute inset-0"
              />
            </div>
          );
        }
        return <Star key={i} size={size} className="text-gray-300" />;
      })}
      {showValue && (
        <span className="ml-2 font-medium text-primary-600">
          {rating.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
}
