import { useState } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { InteractiveMap } from "@/components/InteractiveMap";
import { UserCard } from "@/components/UserCard";
import { ArticleCard } from "@/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, SlidersHorizontal, BookOpen } from "lucide-react";
import { travelArticles } from "@/data/travelArticles";
import type { TravelArticle, AntiqueFair } from "@/data/travelArticles";

export default function Explore() {
  const [selectedArticle, setSelectedArticle] = useState<TravelArticle | null>(null);

  const renderArticleContent = (article: TravelArticle) => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-muted-foreground">{article.content.intro}</p>
        </div>

        {article.content.sections?.map((section, index) => (
          <div key={index} className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
            {typeof section.items[0] === 'string' ? (
              <ul className="space-y-2 list-disc list-inside">
                {(section.items as string[]).map((item, i) => (
                  <li key={i} className="text-sm text-foreground">{item}</li>
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(section.items as AntiqueFair[]).map((fair, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted space-y-1">
                    <h4 className="font-bold text-foreground">{fair.name}</h4>
                    <p className="text-sm text-muted-foreground">{fair.location}</p>
                    <p className="text-xs text-primary font-medium">{fair.timing}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {article.content.tips && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">Pro Tips</h3>
            <ul className="space-y-2 list-disc list-inside">
              {article.content.tips.map((tip, i) => (
                <li key={i} className="text-sm text-foreground">{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {article.content.conclusion && (
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm text-muted-foreground italic">{article.content.conclusion}</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {article.keywords.slice(0, 8).map((keyword) => (
              <Badge key={keyword} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* SEO Meta Tags (would be in actual Head component in production) */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
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

        {/* Travel Articles Section */}
        <div className="border-t pt-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Travel Guides & Tips
              </h2>
            </div>
            <p className="text-muted-foreground">
              Expert advice, destination guides, and insider tips from our community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl leading-tight pr-8">
                  {selectedArticle.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                  <span>By {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                  <span>•</span>
                  <span>{new Date(selectedArticle.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </DialogHeader>
              <div className="mt-6">
                {renderArticleContent(selectedArticle)}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
