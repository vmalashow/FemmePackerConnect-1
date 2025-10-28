import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuickActionType } from "@/pages/AIAssistant";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@shared/schema";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Question {
  text: string;
  placeholder?: string;
}

interface QuestionnaireData {
  action: QuickActionType;
  questions: Question[];
  currentIndex: number;
  answers: string[];
}

interface AIChatProps {
  selectedAction: QuickActionType | null;
  onActionComplete: () => void;
}

const QUESTIONNAIRES: Record<QuickActionType, Question[]> = {
  "Find Destinations": [
    { text: "What's your ideal travel vibe?", placeholder: "e.g., adventure, relaxation, cultural immersion..." },
    { text: "What's your budget range per day?", placeholder: "e.g., $50, $100, flexible..." },
    { text: "What's a must-have for your perfect destination?", placeholder: "e.g., beaches, mountains, nightlife, history..." },
    { text: "When are you planning to travel?", placeholder: "e.g., next month, summer, flexible..." },
    { text: "How long do you usually travel for?", placeholder: "e.g., weekend, week, month..." },
  ],
  "Match with Hosts": [
    { text: "What activities do you enjoy most?", placeholder: "e.g., hiking, cooking, art, music..." },
    { text: "What's your ideal hosting experience?", placeholder: "e.g., independent, social, cultural exchange..." },
    { text: "How do you prefer to communicate?", placeholder: "e.g., chatty, quiet time, balanced..." },
    { text: "Any deal-breakers or must-haves?", placeholder: "e.g., pets, smoking, dietary needs..." },
    { text: "What languages do you speak?", placeholder: "e.g., English, Spanish..." },
  ],
  "Plan Itinerary": [
    { text: "How long is your trip?", placeholder: "e.g., 3 days, 1 week, 2 weeks..." },
    { text: "What are your top interests?", placeholder: "e.g., food, museums, hiking, shopping..." },
    { text: "What's your preferred pace?", placeholder: "e.g., relaxed, moderate, packed schedule..." },
    { text: "What's your budget for the trip?", placeholder: "e.g., budget-friendly, mid-range, luxury..." },
    { text: "Any specific experiences you want to have?", placeholder: "e.g., local cooking class, sunrise hike..." },
  ],
};

export function AIChat({ selectedAction, onActionComplete }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI travel assistant. I can help you plan trips, find destinations, connect with hosts, and answer any travel questions. Try clicking a Quick Action to get personalized recommendations!"
    }
  ]);
  const [input, setInput] = useState('');
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery<Profile>({
    queryKey: ['/api/profile'],
  });

  const suggestions = [
    "Plan my week in Paris",
    "Find eco-friendly hosts",
    "Best solo travel destinations",
    "Connect me with travelers"
  ];

  useEffect(() => {
    if (selectedAction && !questionnaire) {
      const questions = QUESTIONNAIRES[selectedAction];
      
      setQuestionnaire({
        action: selectedAction,
        questions,
        currentIndex: 0,
        answers: []
      });

      const initialMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Great! Let's find the perfect ${selectedAction.toLowerCase()} for you. I'll ask you a few quick questions to personalize your experience. ${questions[0].text}`
      };
      
      setMessages(prev => [...prev, initialMessage]);
    }
  }, [selectedAction, questionnaire]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generatePersonalizedResponse = (action: QuickActionType, answers: string[]) => {
    const mockUsers = [
      { name: "Sarah Chen", location: "Tokyo, Japan", interests: ["hiking", "photography", "cooking"] },
      { name: "Emma Rodriguez", location: "Barcelona, Spain", interests: ["art", "music", "food"] },
      { name: "Maya Patel", location: "Bali, Indonesia", interests: ["yoga", "surfing", "culture"] },
      { name: "Olivia Kim", location: "Paris, France", interests: ["museums", "fashion", "wine"] },
      { name: "Sofia Andersson", location: "Stockholm, Sweden", interests: ["nature", "design", "coffee"] },
    ];

    if (action === "Find Destinations") {
      const [vibe, budget, mustHave, when, duration] = answers;
      const matchedDestinations = [];
      
      if (vibe.toLowerCase().includes("adventure") || mustHave.toLowerCase().includes("mountain")) {
        matchedDestinations.push("🏔️ **Nepal (Kathmandu)** - Perfect for adventure seekers! Maya in Bali just returned from there and loved the trekking.");
      }
      if (vibe.toLowerCase().includes("culture") || mustHave.toLowerCase().includes("histor")) {
        matchedDestinations.push("🏛️ **Greece (Athens)** - Rich in history and culture. Olivia from Paris recommends the Acropolis Museum.");
      }
      if (mustHave.toLowerCase().includes("beach") || vibe.toLowerCase().includes("relax")) {
        matchedDestinations.push("🏖️ **Portugal (Lagos)** - Beautiful beaches and relaxed vibe. Sarah in Tokyo says it's her favorite beach destination.");
      }
      if (vibe.toLowerCase().includes("food") || mustHave.toLowerCase().includes("food")) {
        matchedDestinations.push("🍜 **Thailand (Bangkok)** - Street food paradise! Emma in Barcelona connects you with local food tours.");
      }

      if (matchedDestinations.length === 0) {
        matchedDestinations.push("🌟 **Spain (Barcelona)** - Great mix of everything! Emma lives there and loves hosting travelers.");
        matchedDestinations.push("🗼 **France (Paris)** - Classic destination with endless activities. Olivia is based there and offers city tips.");
      }

      return `Based on your preferences (${vibe} vibe, ${budget} budget, ${duration} duration), here are my top recommendations:\n\n${matchedDestinations.join('\n\n')}\n\n💡 **Pro tip**: ${mockUsers[Math.floor(Math.random() * mockUsers.length)].name} recently traveled on a similar budget and shared great money-saving tips in the community feed!\n\n✨ Want to connect with hosts in any of these locations? Just ask!`;
    }

    if (action === "Match with Hosts") {
      const [activities, experience, communication, dealBreakers, languages] = answers;
      const matchedHosts = [];

      mockUsers.forEach(user => {
        let matchScore = 0;
        let matchReasons = [];

        user.interests.forEach(interest => {
          if (activities.toLowerCase().includes(interest)) {
            matchScore++;
            matchReasons.push(`loves ${interest}`);
          }
        });

        if (matchScore > 0 || matchedHosts.length < 3) {
          matchedHosts.push({
            ...user,
            matchReasons: matchReasons.length > 0 ? matchReasons : ["similar travel style"],
            matchScore
          });
        }
      });

      matchedHosts.sort((a, b) => b.matchScore - a.matchScore);

      const hostList = matchedHosts.slice(0, 3).map((host, i) => 
        `${i + 1}. **${host.name}** in ${host.location}\n   • ${host.matchReasons.join(', ')}\n   • Speaks ${languages.split(',')[0] || 'English'}\n   • Hosting style: ${experience}`
      ).join('\n\n');

      return `I found ${matchedHosts.length} hosts that match your preferences! Here are your top 3 matches:\n\n${hostList}\n\n💬 All these hosts have 5-star ratings and love ${activities.split(',')[0]}! ${matchedHosts[0].name} posted in the community feed yesterday about hosting tips.\n\n🔗 Ready to send a connection request?`;
    }

    if (action === "Plan Itinerary") {
      const [duration, interests, pace, budget, experiences] = answers;
      const days = parseInt(duration) || 7;
      
      const itinerary = [];
      const interestList = interests.toLowerCase().split(',').map(i => i.trim());
      
      if (interestList.some(i => i.includes('food') || i.includes('cooking'))) {
        itinerary.push("🍳 **Day 1-2**: Local food tour & cooking class with Emma in Barcelona");
      } else {
        itinerary.push("🎨 **Day 1-2**: Cultural exploration & museum visits");
      }

      if (interestList.some(i => i.includes('hik') || i.includes('nature'))) {
        itinerary.push("🥾 **Day 3-4**: Hiking excursion with local guide (Sofia recommends the coastal trails!)");
      } else {
        itinerary.push("🏛️ **Day 3-4**: Historical sites & architecture tour");
      }

      if (pace.toLowerCase().includes('relax')) {
        itinerary.push(`☕ **Day 5-${days}**: Flexible days - beach time, cafes, and spontaneous adventures`);
      } else {
        itinerary.push(`⚡ **Day 5-${days}**: Action-packed activities: ${experiences || 'local experiences, shopping, nightlife'}`);
      }

      return `Here's a personalized ${days}-day itinerary based on your ${pace} pace and ${budget} budget:\n\n${itinerary.join('\n\n')}\n\n💰 **Budget estimate**: $${(parseInt(budget.match(/\d+/)?.[0] || '100')) * days}/total\n\n👥 **Local insight**: Maya just completed a similar trip and shared her detailed itinerary in the community! She also knows a great ${interestList[0]} spot that's off the beaten path.\n\n🗺️ Want me to add specific restaurants, accommodations, or activities?`;
    }

    return "Thanks for sharing! Let me find the best matches for you.";
  };

  const handleQuestionnaireAnswer = () => {
    if (!input.trim() || !questionnaire) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    const newAnswers = [...questionnaire.answers, input];
    const nextIndex = questionnaire.currentIndex + 1;

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      if (nextIndex < questionnaire.questions.length) {
        const nextQuestion: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: questionnaire.questions[nextIndex].text
        };
        setMessages(prev => [...prev, nextQuestion]);
        setQuestionnaire({
          ...questionnaire,
          currentIndex: nextIndex,
          answers: newAnswers
        });
      } else {
        const finalResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generatePersonalizedResponse(questionnaire.action, newAnswers)
        };
        setMessages(prev => [...prev, finalResponse]);
        setQuestionnaire(null);
        onActionComplete();
      }
    }, 500);
  };

  const handleSend = () => {
    if (questionnaire) {
      handleQuestionnaireAnswer();
      return;
    }

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
        content: "I'd be happy to help you with that! For the best personalized recommendations, try using one of the Quick Actions on the right. I can ask you a few questions to really tailor my suggestions to your needs!"
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const currentPlaceholder = questionnaire 
    ? questionnaire.questions[questionnaire.currentIndex].placeholder || "Type your answer..."
    : "Ask me anything about travel...";

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-bold text-foreground">AI Travel Assistant</h2>
        {questionnaire && (
          <Badge variant="secondary" className="ml-auto">
            Question {questionnaire.currentIndex + 1}/{questionnaire.questions.length}
          </Badge>
        )}
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
                className={`max-w-[80%] rounded-lg p-3 whitespace-pre-line ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border space-y-3">
        {!questionnaire && (
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
        )}

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={currentPlaceholder}
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
