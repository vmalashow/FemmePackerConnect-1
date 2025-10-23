import { BottomNav } from '../BottomNav';
import { ThemeProvider } from '../ThemeProvider';

export default function BottomNavExample() {
  return (
    <ThemeProvider>
      <div className="h-screen bg-background pb-16">
        <div className="p-4">
          <p className="text-foreground">Content area</p>
        </div>
        <BottomNav />
      </div>
    </ThemeProvider>
  );
}
