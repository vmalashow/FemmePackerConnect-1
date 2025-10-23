import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Shield, Star } from "lucide-react";

interface UserCardProps {
  name: string;
  location: string;
  bio: string;
  interests: string[];
  isVerified?: boolean;
  rating?: number;
  avatarUrl?: string;
  isHost?: boolean;
}

export function UserCard({ 
  name, 
  location, 
  bio, 
  interests, 
  isVerified = false,
  rating = 5,
  avatarUrl,
  isHost = false 
}: UserCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="p-6 hover-elevate" data-testid={`card-user-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-foreground truncate" data-testid={`text-username-${name.toLowerCase().replace(/\s+/g, '-')}`}>
                {name}
              </h3>
              {isVerified && (
                <Shield className="h-4 w-4 text-primary flex-shrink-0" data-testid="icon-verified" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground line-clamp-2">{bio}</p>

        <div className="flex flex-wrap gap-2">
          {interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>

        <Button variant="default" className="w-full" data-testid="button-connect">
          {isHost ? 'View Profile' : 'Connect'}
        </Button>
      </div>
    </Card>
  );
}
