import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Send } from "lucide-react";

interface HostingRequestFormProps {
  hostId: string;
  hostName: string;
  onSuccess?: () => void;
}

export function HostingRequestForm({ hostId, hostName, onSuccess }: HostingRequestFormProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/hosting-requests", {
        method: "POST",
        body: {
          guestId: "demo-user-123",
          hostId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          message,
          status: "pending",
        },
      });
    },
    onSuccess: () => {
      toast({ title: "Request sent!", description: `Hosting request sent to ${hostName}` });
      setCheckIn("");
      setCheckOut("");
      setMessage("");
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send hosting request", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast({ title: "Required", description: "Please enter check-in and check-out dates", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4 text-foreground">Request to stay with {hostName}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Check-in date</label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            data-testid="input-checkin-date"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Check-out date</label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            data-testid="input-checkout-date"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Message (optional)</label>
          <Textarea
            placeholder="Tell them about yourself..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none"
            data-testid="textarea-hosting-message"
          />
        </div>
        <Button type="submit" disabled={mutation.isPending} className="w-full" data-testid="button-send-request">
          {mutation.isPending ? "Sending..." : <>
            <Send className="w-4 h-4 mr-2" />
            Send Request
          </>}
        </Button>
      </form>
    </Card>
  );
}
