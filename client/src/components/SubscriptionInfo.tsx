import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Zap } from "lucide-react";

interface QuotaData {
  tier: string;
  aiMessages: number;
  aiLimit: number;
  hostMessages: number;
  hostLimit: number;
  canSendToAI: boolean;
  canSendToHost: boolean;
}

export function SubscriptionInfo() {
  const { data: quota } = useQuery<QuotaData>({
    queryKey: ["/api/quota"],
  });

  if (!quota) return null;

  const isPremium = quota.tier === "premium";
  const aiUsage = `${quota.aiMessages}/${quota.aiLimit === -1 ? "∞" : quota.aiLimit}`;
  const hostUsage = `${quota.hostMessages}/${quota.hostLimit === -1 ? "∞" : quota.hostLimit}`;

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">Your Plan</h3>
          <Badge variant={isPremium ? "default" : "secondary"}>
            {isPremium ? "Premium" : "Free"}
          </Badge>
        </div>

        {!isPremium && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-medium mb-1">Limited Messages</p>
              <p>Upgrade to Premium for unlimited messaging</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">AI Messages</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${quota.aiLimit === -1 ? 0 : (quota.aiMessages / quota.aiLimit) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium min-w-fit">{aiUsage}</span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Host Messages</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${quota.hostLimit === -1 ? 0 : (quota.hostMessages / quota.hostLimit) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium min-w-fit">{hostUsage}</span>
            </div>
          </div>
        </div>

        {!isPremium && (
          <Button className="w-full" size="sm" data-testid="button-upgrade-premium">
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Premium - €3/month
          </Button>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Limits reset on the 1st of each month
        </div>
      </div>
    </Card>
  );
}
