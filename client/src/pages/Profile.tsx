import { MobileHeader } from "@/components/MobileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield, Star, Edit, Settings, LogOut } from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <MobileHeader title="Profile" showActions={false} />
      
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="p-6 mb-6">
          <div className="flex flex-col items-center text-center gap-4 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">Jane Doe</h2>
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span>New York, USA</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">5.0</span>
                <span className="text-sm text-muted-foreground ml-1">(12 reviews)</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" data-testid="button-edit-profile">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <h3 className="font-semibold text-foreground mb-2">About Me</h3>
              <p className="text-sm text-muted-foreground">
                Travel enthusiast and cultural explorer. I love meeting new people and sharing stories over coffee. Happy to host travelers and show them the real New York!
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Art</Badge>
                <Badge variant="secondary">Photography</Badge>
                <Badge variant="secondary">Food</Badge>
                <Badge variant="secondary">Hiking</Badge>
                <Badge variant="secondary">Culture</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">English</Badge>
                <Badge variant="outline">Spanish</Badge>
                <Badge variant="outline">French</Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings & Privacy
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
