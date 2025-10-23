import { Header } from "@/components/Header";
import { AIChat } from "@/components/AIChat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Users, Compass } from "lucide-react";

export default function AIAssistant() {
  const quickActions = [
    { icon: MapPin, label: "Find Destinations", color: "text-primary" },
    { icon: Users, label: "Match with Hosts", color: "text-chart-2" },
    { icon: Compass, label: "Plan Itinerary", color: "text-chart-3" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                AI Travel Assistant
              </h1>
              <p className="text-muted-foreground">
                Your personal travel companion powered by AI
              </p>
            </div>

            <AIChat />
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-3 p-3 rounded-md hover-elevate active-elevate-2 text-left"
                    data-testid={`button-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4">What I Can Help With</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Trip Planning</h4>
                  <p className="text-xs text-muted-foreground">
                    Get personalized itineraries based on your interests, budget, and travel style.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Host Matching</h4>
                  <p className="text-xs text-muted-foreground">
                    Find the perfect hosts based on shared interests and compatibility.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Travel Advice</h4>
                  <p className="text-xs text-muted-foreground">
                    Get safety tips, local insights, and answers to all your travel questions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Destination Discovery</h4>
                  <p className="text-xs text-muted-foreground">
                    Explore new places that match your preferences and travel goals.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-bold text-foreground mb-3">Popular Requests</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer hover-elevate">
                  Budget tips
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover-elevate">
                  Solo travel
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover-elevate">
                  Europe routes
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover-elevate">
                  Safety advice
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover-elevate">
                  Local culture
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover-elevate">
                  Packing tips
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
