import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Upload } from "lucide-react";

interface MapUploadFormProps {
  onSuccess?: () => void;
}

export function MapUploadForm({ onSuccess }: MapUploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [isPublic, setIsPublic] = useState(true);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/user-maps", {
        userId: "demo-user-123",
        title,
        description,
        price: parseFloat(price),
        isPublic,
        mapData: { markers: [] },
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Map uploaded successfully" });
      setTitle("");
      setDescription("");
      setPrice("0");
      setIsPublic(true);
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload map", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Required", description: "Map title is required", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4 text-foreground">Share Your Map</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Map Title</label>
          <Input
            placeholder="e.g., Hidden Gems of Barcelona"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid="input-map-title"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
          <Textarea
            placeholder="Describe your map, locations, tips..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
            data-testid="textarea-map-description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Price (0 = Free)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              data-testid="input-map-price"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Visibility</label>
            <select
              value={isPublic ? "public" : "private"}
              onChange={(e) => setIsPublic(e.target.value === "public")}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
              data-testid="select-map-visibility"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        <Button type="submit" disabled={mutation.isPending} className="w-full" data-testid="button-upload-map">
          {mutation.isPending ? "Uploading..." : <>
            <Upload className="w-4 h-4 mr-2" />
            Share Map
          </>}
        </Button>
      </form>
    </Card>
  );
}
