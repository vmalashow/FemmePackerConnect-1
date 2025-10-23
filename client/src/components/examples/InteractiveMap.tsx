import { InteractiveMap } from '../InteractiveMap';
import { ThemeProvider } from '../ThemeProvider';

export default function InteractiveMapExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <InteractiveMap />
      </div>
    </ThemeProvider>
  );
}
