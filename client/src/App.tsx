import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Community from "@/pages/Community";
import AIAssistant from "@/pages/AIAssistant";
import Profile from "@/pages/Profile";
import HostMatches from "@/pages/HostMatches";
import HostProfile from "@/pages/HostProfile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/community" component={Community} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/profile" component={Profile} />
      <Route path="/host-matches" component={HostMatches} />
      <Route path="/host/:id" component={HostProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <BottomNav />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
