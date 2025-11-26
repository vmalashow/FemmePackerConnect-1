import { MobileHeader } from "@/components/MobileHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewCard } from "@/components/ReviewCard";
import { HostingRequestForm } from "@/components/HostingRequestForm";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Star, MapPin, Calendar, Users, CheckCircle2 } from "lucide-react";
import type { Profile, Review } from "@shared/schema";

export default function HostProfile() {
  const [location] = useLocation();
  const hostId = location.split("/").pop();

  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews", hostId],
  });

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <MobileHeader title={profile.name || "Host Profile"} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                  {profile.country && (
                    <div className="flex items-center gap-1 text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4" />
                      {profile.country}
                    </div>
                  )}
                </div>
                {profile.rating && profile.rating > 0 && (
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(profile.rating!) ? "fill-primary text-primary" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold">{profile.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {profile.passportVerified && (
                <Badge className="mb-4">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified Host
                </Badge>
              )}

              {profile.aboutMe && <p className="text-foreground mb-4">{profile.aboutMe}</p>}

              <div className="grid grid-cols-2 gap-4">
                {profile.maxCapacity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Hosts up to {profile.maxCapacity} guests</span>
                  </div>
                )}
                {profile.maxDuration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{profile.maxDuration}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4">Reviews ({reviews.length})</h3>
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      guestName="Guest"
                      rating={review.rating}
                      comment={review.comment || undefined}
                      date={review.createdAt?.toString() || new Date().toISOString()}
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Request Sidebar */}
          <div>
            <HostingRequestForm hostId={profile.id} hostName={profile.name || "Host"} />
          </div>
        </div>
      </div>
    </div>
  );
}
