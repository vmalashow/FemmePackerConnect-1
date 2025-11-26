import { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, ArrowRight, Map, Users, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuickActionType } from "@/pages/AIAssistant";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@shared/schema";
import { Link } from "wouter";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  followUpActions?: FollowUpAction[];
}

interface FollowUpAction {
  label: string;
  action: QuickActionType;
  icon?: LucideIcon;
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

// Helper function to render text with clickable references
function renderContentWithLinks(content: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Pattern to match member names and destination phrases (with optional markdown and city qualifiers)
  const linkPattern = /\*\*(Sarah Chen|Emma Rodriguez|Maya Patel|Olivia Kim|Sofia Andersson|Nepal \(Kathmandu\)|Greece \(Athens\)|Portugal \(Lagos\)|Thailand \(Bangkok\)|Spain \(Barcelona\)|France \(Paris\))\*\*|(Sarah Chen|Emma Rodriguez|Maya Patel|Olivia Kim|Sofia Andersson)/g;
  
  let match;
  while ((match = linkPattern.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    
    // Extract the actual name/destination (group 1 has markdown matches, group 2 has plain member names)
    const matchedText = match[1] || match[2];
    const isMember = ['Sarah Chen', 'Emma Rodriguez', 'Maya Patel', 'Olivia Kim', 'Sofia Andersson'].includes(matchedText.replace(/\s*\(.*?\)/, ''));
    const testIdPrefix = isMember ? 'member' : 'destination';
    const testIdSlug = matchedText.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    
    // Add the clickable link
    parts.push(
      <Link 
        key={`${testIdPrefix}-${match.index}`}
        href="/explore"
        className="text-primary hover:underline font-bold cursor-pointer"
        data-testid={`link-${testIdPrefix}-${testIdSlug}`}
      >
        {matchedText}
      </Link>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : content;
}

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
        content: `Great! Let's find the perfect ${selectedAction.toLowerCase()} for you. I'll ask you a few quick questions to personalize your experience.\n\n${questions[0].text}`
      };
      
      setMessages(prev => [...prev, initialMessage]);
    }
  }, [selectedAction, questionnaire]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const generatePersonalizedResponse = (action: QuickActionType, answers: string[]): { content: string; followUpActions: FollowUpAction[] } => {
    interface MatchedHost {
      name: string;
      location: string;
      interests: string[];
      matchReasons: string[];
      matchScore: number;
    }

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
      let primaryDestination = "Barcelona";
      
      if (vibe.toLowerCase().includes("adventure") || mustHave.toLowerCase().includes("mountain")) {
        matchedDestinations.push("**Nepal (Kathmandu)** - Perfect for adventure seekers! Maya Patel in Bali just returned from there and loved the trekking.");
        primaryDestination = "Nepal";
      }
      if (vibe.toLowerCase().includes("culture") || mustHave.toLowerCase().includes("histor")) {
        matchedDestinations.push("**Greece (Athens)** - Rich in history and culture. Olivia Kim from Paris recommends the Acropolis Museum.");
        primaryDestination = "Greece";
      }
      if (mustHave.toLowerCase().includes("beach") || vibe.toLowerCase().includes("relax")) {
        matchedDestinations.push("**Portugal (Lagos)** - Beautiful beaches and relaxed vibe. Sarah Chen in Tokyo says it's her favorite beach destination.");
        primaryDestination = "Portugal";
      }
      if (vibe.toLowerCase().includes("food") || mustHave.toLowerCase().includes("food")) {
        matchedDestinations.push("**Thailand (Bangkok)** - Street food paradise! Emma Rodriguez in Barcelona can connect you with local food tours.");
        primaryDestination = "Thailand";
      }

      if (matchedDestinations.length === 0) {
        matchedDestinations.push("**Spain (Barcelona)** - Great mix of everything! Emma Rodriguez lives there and loves hosting travelers.");
        matchedDestinations.push("**France (Paris)** - Classic destination with endless activities. Olivia Kim is based there and offers city tips.");
        primaryDestination = "France";
      }

      const content = `Based on your preferences (${vibe} vibe, ${budget} budget, ${duration} duration), here are my top recommendations:\n\n${matchedDestinations.join('\n\n')}\n\n**Pro tip**: ${mockUsers[Math.floor(Math.random() * mockUsers.length)].name} recently traveled on a similar budget and shared great money-saving tips in the community feed!\n\nWant to connect with hosts in any of these locations? Just ask!`;
      
      const followUpActions: FollowUpAction[] = [
        { label: `Plan itinerary for ${primaryDestination}`, action: "Plan Itinerary", icon: Map },
        { label: "Find hosts in this area", action: "Match with Hosts", icon: Users }
      ];

      return { content, followUpActions };
    }

    if (action === "Match with Hosts") {
      const [activities, experience, communication, dealBreakers, languages] = answers;
      const matchedHosts: MatchedHost[] = [];

      mockUsers.forEach(user => {
        let matchScore = 0;
        const matchReasons: string[] = [];

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

      const content = `I found ${matchedHosts.length} hosts that match your preferences! Here are your top 3 matches:\n\n${hostList}\n\nAll these hosts have 5-star ratings and love ${activities.split(',')[0]}! ${matchedHosts[0].name} posted in the community feed yesterday about hosting tips.\n\nReady to send a connection request?`;
      
      const topHost = matchedHosts[0];
      const topLocation = topHost.location.split(',')[0];
      const followUpActions: FollowUpAction[] = [
        { label: `Plan trip to ${topLocation}`, action: "Plan Itinerary", icon: Map },
        { label: "Explore more destinations", action: "Find Destinations", icon: MapPin }
      ];

      return { content, followUpActions };
    }

    if (action === "Plan Itinerary") {
      const [duration, interests, pace, budget, experiences] = answers;
      const days = parseInt(duration) || 7;
      
      const itinerary = [];
      const interestList = interests.toLowerCase().split(',').map(i => i.trim());
      
      if (interestList.some(i => i.includes('food') || i.includes('cooking'))) {
        itinerary.push("**Day 1-2**: Local food tour & cooking class with Emma Rodriguez in Barcelona");
      } else {
        itinerary.push("**Day 1-2**: Cultural exploration & museum visits");
      }

      if (interestList.some(i => i.includes('hik') || i.includes('nature'))) {
        itinerary.push("**Day 3-4**: Hiking excursion with local guide (Sofia Andersson recommends the coastal trails!)");
      } else {
        itinerary.push("**Day 3-4**: Historical sites & architecture tour");
      }

      if (pace.toLowerCase().includes('relax')) {
        itinerary.push(`**Day ${days > 4 ? '5' : '3'}-${days}**: Flexible days - beach time, cafes, and spontaneous adventures`);
      } else {
        itinerary.push(`**Day ${days > 4 ? '5' : '3'}-${days}**: Action-packed activities: ${experiences || 'local experiences, shopping, nightlife'}`);
      }

      const content = `Here's a personalized ${days}-day itinerary based on your ${pace} pace and ${budget} budget:\n\n${itinerary.join('\n\n')}\n\n**Budget estimate**: $${(parseInt(budget.match(/\d+/)?.[0] || '100')) * days}/total\n\n**Local insight**: Maya Patel just completed a similar trip and shared her detailed itinerary in the community! She also knows a great ${interestList[0]} spot that's off the beaten path.\n\nWant me to add specific restaurants, accommodations, or activities?`;
      
      const followUpActions: FollowUpAction[] = [
        { label: "Match with local hosts", action: "Match with Hosts", icon: Users },
        { label: "Find more destinations", action: "Find Destinations", icon: MapPin }
      ];

      return { content, followUpActions };
    }

    return { content: "Thanks for sharing! Let me find the best matches for you.", followUpActions: [] };
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
        const { content, followUpActions } = generatePersonalizedResponse(questionnaire.action, newAnswers);
        const finalResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content,
          followUpActions
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
    
    setTimeout(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input })
        });
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content || "I'd be happy to help with that! For personalized recommendations, try clicking one of the Quick Actions on the left sidebar. I can ask you a few questions to tailor my suggestions to your needs!"
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Chat error:', error);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'd be happy to help with that! For personalized recommendations, try clicking one of the Quick Actions on the left sidebar. I can ask you a few questions to tailor my suggestions to your needs!"
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleFollowUpAction = (action: QuickActionType) => {
    // Trigger the parent component to start the new action
    onActionComplete(); // Clear any existing action state
    setTimeout(() => {
      const questions = QUESTIONNAIRES[action];
      
      setQuestionnaire({
        action,
        questions,
        currentIndex: 0,
        answers: []
      });

      const initialMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Great! Let's ${action.toLowerCase()} for you. I'll ask you a few quick questions to personalize your experience.\n\n${questions[0].text}`
      };
      
      setMessages(prev => [...prev, initialMessage]);
    }, 100);
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

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
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
                  {message.role === 'assistant' ? renderContentWithLinks(message.content) : message.content}
                </div>
              </div>
              
              {/* Follow-up action buttons */}
              {message.followUpActions && message.followUpActions.length > 0 && (
                <div className="flex justify-start mt-2">
                  <div className="max-w-[80%] flex flex-wrap gap-2">
                    {message.followUpActions.map((action, idx) => {
                      const IconComponent = action.icon;
                      return (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => handleFollowUpAction(action.action)}
                          className="text-xs"
                          data-testid={`button-followup-${action.action.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {IconComponent && <IconComponent className="mr-1 h-3 w-3" />}
                          {action.label}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
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
