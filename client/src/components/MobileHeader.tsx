import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface MobileHeaderProps {
  title: string;
  showActions?: boolean;
}

export function MobileHeader({ title, showActions = true }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
        {showActions && (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
