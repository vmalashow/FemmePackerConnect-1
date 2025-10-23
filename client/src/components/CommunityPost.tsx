import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

interface CommunityPostProps {
  author: string;
  authorAvatar?: string;
  location: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export function CommunityPost({ 
  author, 
  authorAvatar, 
  location,
  timeAgo,
  content, 
  imageUrl,
  likes: initialLikes,
  comments 
}: CommunityPostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const initials = author.split(' ').map(n => n[0]).join('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <Card className="overflow-hidden" data-testid={`card-post-${author.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={authorAvatar} alt={author} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{author}</p>
            <p className="text-sm text-muted-foreground truncate">
              {location} • {timeAgo}
            </p>
          </div>
        </div>

        <p className="text-foreground mb-4 leading-relaxed">{content}</p>

        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Post content" 
            className="w-full rounded-md mb-4 object-cover max-h-80"
          />
        )}

        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${isLiked ? 'text-pink-500' : ''}`}
            onClick={handleLike}
            data-testid="button-like-post"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-pink-500' : ''}`} />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" data-testid="button-comment-post">
            <MessageCircle className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 ml-auto" data-testid="button-share-post">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
