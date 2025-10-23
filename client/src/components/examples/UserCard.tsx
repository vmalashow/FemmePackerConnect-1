import { UserCard } from '../UserCard';
import { ThemeProvider } from '../ThemeProvider';

export default function UserCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="max-w-sm">
          <UserCard
            name="Sofia Martinez"
            location="Barcelona, Spain"
            bio="Love exploring local markets and hidden cafes. Happy to show you the real Barcelona!"
            interests={['Art', 'Food', 'Culture', 'Hiking']}
            isVerified={true}
            rating={4.9}
            isHost={true}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
