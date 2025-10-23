import { CommunityPost } from '../CommunityPost';
import { ThemeProvider } from '../ThemeProvider';
import hostingImage from '@assets/generated_images/Women_connecting_through_hosting_da9372d5.png';

export default function CommunityPostExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="max-w-2xl">
          <CommunityPost
            author="Emma Johnson"
            location="London, UK"
            timeAgo="2 hours ago"
            content="Just hosted the most amazing traveler from Brazil! We spent the afternoon exploring Camden Market and sharing stories. This is what FemmePacker is all about - real connections that turn into lifelong friendships. 💜"
            imageUrl={hostingImage}
            likes={42}
            comments={8}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
