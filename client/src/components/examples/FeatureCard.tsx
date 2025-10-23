import { FeatureCard } from '../FeatureCard';
import { ThemeProvider } from '../ThemeProvider';
import { Globe } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="max-w-sm">
          <FeatureCard
            icon={Globe}
            title="Worldwide Network"
            description="Find and connect with women hosts and travelers across the globe."
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
