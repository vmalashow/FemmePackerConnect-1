import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI travel assistant. I can help you plan trips, find destinations, connect with hosts, and answer any travel questions. Where would you like to explore?"
    }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    "Plan my week in Paris",
    "Find eco-friendly hosts",
    "Best solo travel destinations",
    "Connect me with travelers"
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'd be happy to help you with that! Let me find the best options for you based on your interests and travel style."
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-bold text-foreground">AI Travel Assistant</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.role}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              variant="secondary"
              className="cursor-pointer hover-elevate"
              onClick={() => handleSuggestionClick(suggestion)}
              data-testid={`badge-suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {suggestion}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about travel..."
            data-testid="input-chat-message"
          />
          <Button onClick={handleSend} size="icon" data-testid="button-send-message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
