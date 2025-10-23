import { Header } from "@/components/Header";
import { CommunityPost } from "@/components/CommunityPost";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, TrendingUp, MessageSquare, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import hostingImage from "@assets/generated_images/Women_connecting_through_hosting_da9372d5.png";
import soloTravelerImage from "@assets/generated_images/Solo_female_traveler_inspiring_56a4b03e.png";

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Community Feed
              </h1>
              <p className="text-muted-foreground">
                Share your experiences and connect with fellow travelers
              </p>
            </div>

            <Card className="p-6">
              <div className="flex gap-4">
                <Textarea 
                  placeholder="Share your travel story, ask a question, or give advice..."
                  className="min-h-[100px]"
                  data-testid="textarea-new-post"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button data-testid="button-create-post">
                  <Plus className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </Card>

            <div className="space-y-6">
              <CommunityPost
                author="Emma Johnson"
                location="London, UK"
                timeAgo="2 hours ago"
                content="Just hosted the most amazing traveler from Brazil! We spent the afternoon exploring Camden Market and sharing stories. This is what FemmePacker is all about - real connections that turn into lifelong friendships. 💜"
                imageUrl={hostingImage}
                likes={42}
                comments={8}
              />
              <CommunityPost
                author="Ana Silva"
                location="Rio de Janeiro, Brazil"
                timeAgo="5 hours ago"
                content="Solo travel tip: Always trust your instincts! Just finished an incredible month backpacking through Europe, and the FemmePacker community made me feel safe and supported every step of the way. Thank you all! 🌍"
                imageUrl={soloTravelerImage}
                likes={67}
                comments={12}
              />
              <CommunityPost
                author="Sofia Martinez"
                location="Barcelona, Spain"
                timeAgo="8 hours ago"
                content="Question for the community: What's your favorite off-the-beaten-path destination in Southeast Asia? Planning my next adventure and would love some recommendations from experienced travelers!"
                likes={23}
                comments={15}
              />
              <CommunityPost
                author="Maya Patel"
                location="Mumbai, India"
                timeAgo="1 day ago"
                content="Travel safety tip: I always share my location with a trusted friend back home and check in daily. Simple but effective! What are your essential safety practices when traveling solo?"
                likes={89}
                comments={24}
              />
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between hover-elevate p-2 rounded-md cursor-pointer">
                  <span className="text-sm text-foreground">#SoloTravel</span>
                  <Badge variant="secondary">245 posts</Badge>
                </div>
                <div className="flex items-center justify-between hover-elevate p-2 rounded-md cursor-pointer">
                  <span className="text-sm text-foreground">#SafetyTips</span>
                  <Badge variant="secondary">189 posts</Badge>
                </div>
                <div className="flex items-center justify-between hover-elevate p-2 rounded-md cursor-pointer">
                  <span className="text-sm text-foreground">#HostingStories</span>
                  <Badge variant="secondary">167 posts</Badge>
                </div>
                <div className="flex items-center justify-between hover-elevate p-2 rounded-md cursor-pointer">
                  <span className="text-sm text-foreground">#TravelBuddies</span>
                  <Badge variant="secondary">142 posts</Badge>
                </div>
                <div className="flex items-center justify-between hover-elevate p-2 rounded-md cursor-pointer">
                  <span className="text-sm text-foreground">#BudgetTravel</span>
                  <Badge variant="secondary">128 posts</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Active Discussions
              </h3>
              <div className="space-y-4">
                <div className="hover-elevate p-3 rounded-md cursor-pointer">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Best hostels in Southeast Asia
                  </p>
                  <p className="text-xs text-muted-foreground">32 replies • 2h ago</p>
                </div>
                <div className="hover-elevate p-3 rounded-md cursor-pointer">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Visa tips for digital nomads
                  </p>
                  <p className="text-xs text-muted-foreground">48 replies • 5h ago</p>
                </div>
                <div className="hover-elevate p-3 rounded-md cursor-pointer">
                  <p className="text-sm font-medium text-foreground mb-1">
                    How to pack light for long trips
                  </p>
                  <p className="text-xs text-muted-foreground">61 replies • 1d ago</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Community Stats
              </h3>
              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-2xl font-bold text-primary">12,458</p>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">3,892</p>
                  <p className="text-sm text-muted-foreground">Verified Hosts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">156</p>
                  <p className="text-sm text-muted-foreground">Countries</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
