import { MobileHeader } from "@/components/MobileHeader";
import { HostCard } from "@/components/HostCard";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Users, Loader2 } from "lucide-react";
import type { Profile } from "@shared/schema";

export default function HostMatches() {
  const { data: hosts, isLoading } = useQuery<(Profile & { matchScore?: number; matchReasons?: string[] })[]>({
    queryKey: ["/api/hosts/match"],
  });

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <MobileHeader title="Host Matches" />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Perfect Matches for You
          </h1>
          <p className="text-muted-foreground">Hosts selected based on your interests and preferences</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !hosts || hosts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No hosts found matching your preferences. Try updating your profile!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hosts.map((host) => (
              <HostCard key={host.id} host={host} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
