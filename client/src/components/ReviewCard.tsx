import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewCardProps {
  guestName: string;
  rating: number;
  comment?: string;
  date: string;
}

export function ReviewCard({ guestName, rating, comment, date }: ReviewCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-foreground">{guestName}</h4>
          <p className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
              data-testid={`star-${i + 1}`}
            />
          ))}
        </div>
      </div>
      {comment && <p className="text-sm text-foreground">{comment}</p>}
    </Card>
  );
}
