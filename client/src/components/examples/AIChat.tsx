import { AIChat } from '../AIChat';
import { ThemeProvider } from '../ThemeProvider';

export default function AIChatExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="max-w-2xl">
          <AIChat />
        </div>
      </div>
    </ThemeProvider>
  );
}
