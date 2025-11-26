import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { useState } from "react";
import { HostingRequestForm } from "./HostingRequestForm";
import type { Profile } from "@shared/schema";

interface HostCardProps {
  host: Profile & { matchScore?: number; matchReasons?: string[] };
}

export function HostCard({ host }: HostCardProps) {
  const [showRequest, setShowRequest] = useState(false);

  return (
    <Card className="p-4 space-y-4">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{host.name}</h3>
            {host.country && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                {host.country}
              </div>
            )}
          </div>
          {host.rating && host.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-semibold">{host.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {host.aboutMe && <p className="text-sm text-foreground mb-3">{host.aboutMe}</p>}

        {host.interests && host.interests.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Interests</p>
            <div className="flex flex-wrap gap-2">
              {host.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {host.matchReasons && host.matchReasons.length > 0 && (
          <div className="bg-primary/5 p-2 rounded text-xs text-foreground mb-3">
            <p className="font-semibold mb-1">Match: {host.matchReasons.join(" • ")}</p>
          </div>
        )}

        {host.passportVerified && (
          <Badge className="mb-3" variant="default">
            ✓ Verified
          </Badge>
        )}
      </div>

      {!showRequest ? (
        <Button
          onClick={() => setShowRequest(true)}
          className="w-full"
          data-testid={`button-request-${host.id}`}
        >
          Request to Stay
        </Button>
      ) : (
        <HostingRequestForm hostId={host.id} hostName={host.name || "Host"} onSuccess={() => setShowRequest(false)} />
      )}
    </Card>
  );
}
