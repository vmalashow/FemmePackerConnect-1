import { MobileHeader } from "@/components/MobileHeader";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { UserCard } from "@/components/UserCard";
import { CommunityPost } from "@/components/CommunityPost";
import { Button } from "@/components/ui/button";
import { Globe, Shield, Users, Sparkles, ArrowRight } from "lucide-react";
import soloTravelerImage from "@assets/generated_images/Solo_female_traveler_inspiring_56a4b03e.png";
import hostingImage from "@assets/generated_images/Women_connecting_through_hosting_da9372d5.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <div className="md:hidden">
        <MobileHeader title="FemmePacker" showActions={true} />
      </div>
      <Hero />

      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose FemmePacker?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We've built a platform that puts safety, connection, and empowerment at the heart of every journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Globe}
              title="Worldwide Network"
              description="Find and connect with women hosts and travelers across the globe."
            />
            <FeatureCard
              icon={Shield}
              title="Safety First"
              description="Built by women, for women, with features designed to create peace of mind."
            />
            <FeatureCard
              icon={Users}
              title="Real Connections"
              description="From cultural exchange to lifelong friendships, travel becomes richer when shared."
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with amazing women from around the world who share your passion for travel and adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <UserCard
              name="Sofia Martinez"
              location="Barcelona, Spain"
              bio="Love exploring local markets and hidden cafes. Happy to show you the real Barcelona!"
              interests={['Art', 'Food', 'Culture']}
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
          </div>

          <div className="text-center">
            <Button variant="default" size="lg" data-testid="button-browse-members">
              Browse All Members
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Community Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences shared by our members from around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your AI Travel Assistant
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get personalized travel recommendations, plan your itinerary, and find the perfect travel companions with our AI-powered assistant. Available 24/7 to help you explore the world with confidence.
            </p>
            <Button variant="default" size="lg" data-testid="button-try-ai-assistant">
              Try AI Assistant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">FemmePacker</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering women to travel the world safely, one connection at a time.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Find Hosts</a></li>
                <li><a href="#" className="hover:text-foreground">Travel Stories</a></li>
                <li><a href="#" className="hover:text-foreground">Safety Tips</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Trust & Safety</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Our Mission</a></li>
                <li><a href="#" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
            © 2025 FemmePacker. Built with 💜 for women travelers worldwide.
          </div>
        </div>
      </footer>
    </div>
  );
}
