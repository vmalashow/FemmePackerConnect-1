import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import type { TravelArticle } from "@/data/travelArticles";

interface ArticleCardProps {
  article: TravelArticle;
  onClick?: () => void;
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <Card 
      className="overflow-hidden hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`card-article-${article.slug}`}
    >
      <div className="aspect-video bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 flex items-center justify-center border-b">
        <div className="text-center p-6">
          <h3 className="text-lg font-bold text-foreground line-clamp-2">
            {article.title}
          </h3>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {article.category}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
