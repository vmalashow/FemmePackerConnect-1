import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Globe, Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2" data-testid="link-home">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">FemmePacker</span>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <a>
                <Button variant="ghost" data-testid="link-home-nav">
                  Home
                </Button>
              </a>
            </Link>
            <Link href="/explore">
              <a>
                <Button variant="ghost" data-testid="link-explore">
                  Explore
                </Button>
              </a>
            </Link>
            <Link href="/community">
              <a>
                <Button variant="ghost" data-testid="link-community">
                  Community
                </Button>
              </a>
            </Link>
            <Link href="/ai-assistant">
              <a>
                <Button variant="ghost" data-testid="link-ai-assistant">
                  AI Assistant
                </Button>
              </a>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-profile">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="default" className="hidden sm:flex" data-testid="button-get-started">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
