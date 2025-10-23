import { Link, useLocation } from "wouter";
import { Home, Compass, Users, Sparkles, User } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/explore", label: "Explore", icon: Compass },
  { path: "/community", label: "Community", icon: Users },
  { path: "/ai-assistant", label: "AI", icon: Sparkles },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div 
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-w-[60px] hover-elevate active-elevate-2 cursor-pointer ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
