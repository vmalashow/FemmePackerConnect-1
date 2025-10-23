import { MobileHeader } from "@/components/MobileHeader";
import { InteractiveMap } from "@/components/InteractiveMap";
import { UserCard } from "@/components/UserCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Explore() {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <MobileHeader title="Explore" />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Explore Members
          </h1>
          <p className="text-muted-foreground">
            Find hosts and travelers around the world
          </p>
        </div>

        <div className="mb-8">
          <InteractiveMap />
        </div>

        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by location, interests, or name..." 
                className="pl-10"
                data-testid="input-search-members"
              />
            </div>
            <Button variant="outline" data-testid="button-filters">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <UserCard
            name="Sofia Martinez"
            location="Barcelona, Spain"
            bio="Love exploring local markets and hidden cafes. Happy to show you the real Barcelona!"
            interests={['Art', 'Food', 'Culture', 'Hiking']}
            isVerified={true}
            rating={4.9}
            isHost={true}
          />
          <UserCard
            name="Emma Johnson"
            location="London, UK"
            bio="History buff and music lover. Let's explore museums and catch live shows together!"
            interests={['History', 'Music', 'Art']}
            isVerified={true}
            rating={5.0}
            isHost={true}
          />
          <UserCard
            name="Yuki Tanaka"
            location="Tokyo, Japan"
            bio="Planning my first solo trip to Europe! Looking for travel buddies and local insights."
            interests={['Culture', 'Food', 'Photography']}
            isVerified={false}
            rating={4.8}
            isHost={false}
          />
          <UserCard
            name="Maya Patel"
            location="Mumbai, India"
            bio="Yoga instructor and adventure seeker. Love hiking, meditation, and exploring nature."
            interests={['Yoga', 'Adventure', 'Nature']}
            isVerified={true}
            rating={4.9}
            isHost={true}
          />
          <UserCard
            name="Lucia Romano"
            location="Rome, Italy"
            bio="Art history student who loves showing travelers the hidden gems of Rome!"
            interests={['Art', 'History', 'Food']}
            isVerified={true}
            rating={4.7}
            isHost={true}
          />
          <UserCard
            name="Sarah Chen"
            location="Singapore"
            bio="Foodie and culture enthusiast. Let's explore the best hawker centers and night markets!"
            interests={['Food', 'Culture', 'Photography']}
            isVerified={true}
            rating={4.8}
            isHost={true}
          />
        </div>
      </div>
    </div>
  );
}
