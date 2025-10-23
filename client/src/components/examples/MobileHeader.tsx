import { MobileHeader } from '../MobileHeader';
import { ThemeProvider } from '../ThemeProvider';

export default function MobileHeaderExample() {
  return (
    <ThemeProvider>
      <MobileHeader title="FemmePacker" />
    </ThemeProvider>
  );
}
