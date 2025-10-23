import { useState, useEffect } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Info, Plus, X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@shared/schema";
import { COUNTRIES } from "@/data/countries";
import { LANGUAGES, getLanguageFlag } from "@/data/languages";

const INTEREST_OPTIONS = [
  "Art & Museums",
  "Photography",
  "Food & Cooking",
  "Hiking & Nature",
  "Beach & Water Sports",
  "Culture & History",
  "Music & Concerts",
  "Yoga & Wellness",
  "Shopping",
  "Nightlife",
  "Adventure Sports",
  "Wildlife & Safari",
  "Volunteering",
  "Local Markets",
  "Coffee Culture",
  "Street Art",
  "Architecture",
  "Reading & Literature",
];

const MAX_DURATION_OPTIONS = [
  { value: "weekend", label: "Weekend (2–3 days)" },
  { value: "week", label: "About a week (4–7 days)" },
  { value: "2weeks", label: "Up to 2 weeks" },
  { value: "month", label: "Up to a month" },
  { value: "longer", label: "Longer stays welcome" },
];

const PREFERRED_DAYS_OPTIONS = [
  "Weekdays",
  "Weekends",
  "Doesn't matter",
];

const STAY_LENGTH_OPTIONS = [
  { value: "1-3", label: "Just a few nights (1–3 nights)" },
  { value: "4-7", label: "About a week (4–7 nights)" },
  { value: "1-2w", label: "A couple of weeks (1–2 weeks)" },
  { value: "2-4w", label: "A few weeks (2–4 weeks)" },
  { value: "1m+", label: "Longer adventure (1+ month)" },
  { value: "flexible", label: "Flexible (depends on the trip)" },
];

const TRAVEL_STYLE_OPTIONS = [
  { value: "backpacker", label: "Backpacker", desc: "minimalist, flexible, local" },
  { value: "cultural", label: "Cultural Explorer", desc: "moderate spend on museums, food, events" },
  { value: "comfort", label: "Comfort Seeker", desc: "mid to high-tier comfort" },
  { value: "luxury", label: "Luxury Traveler", desc: "stylish, exclusive, high-end services" },
  { value: "nomad", label: "Digital Nomad", desc: "budget varies, needs Wi-Fi & workspaces" },
];

const TRANSPORT_OPTIONS = [
  "Plane", "Train", "Bus", "Car / Rideshare", "Bicycle", "Walking", "Boat / Ferry"
];

const STAY_TYPE_OPTIONS = [
  "With locals", "Hotel", "Hostel", "Guesthouse / B&B", 
  "Apartment / Airbnb", "Camping / Vanlife"
];

const ACTIVITY_OPTIONS = [
  "Sightseeing & culture",
  "Food & drink experiences",
  "Nature & hiking",
  "Beach & relaxation",
  "Nightlife & music",
  "Shopping",
  "Wellness & self-care",
  "Volunteering / community activities",
  "Work / coworking",
];

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newCustomTransport, setNewCustomTransport] = useState("");
  const [newCustomStay, setNewCustomStay] = useState("");
  const [newCustomActivity, setNewCustomActivity] = useState("");
  const [newCustomPreferredDays, setNewCustomPreferredDays] = useState("");
  
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [bornInOpen, setBornInOpen] = useState(false);
  const [bornInSearch, setBornInSearch] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [previousLocationsOpen, setPreviousLocationsOpen] = useState(false);
  const [previousLocationsSearch, setPreviousLocationsSearch] = useState("");

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      const res = await apiRequest("POST", "/api/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
      toast({ title: "Profile created successfully!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      const res = await apiRequest("PATCH", "/api/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
      toast({ title: "Profile updated successfully!" });
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    } else {
      setFormData({
        canHost: false,
        availabilityFlexible: true,
        languages: [],
        interests: [],
        previousLocations: [],
        preferredTransport: [],
        customTransport: [],
        preferredStay: [],
        customStay: [],
        preferredActivities: [],
        customActivities: [],
        preferredDays: [],
      });
      setIsEditing(true);
    }
  }, [profile]);

  const handleSave = () => {
    if (profile) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleArrayItem = (field: keyof Profile, item: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    setFormData({ ...formData, [field]: newArray });
  };

  const addCustomItem = (baseField: string, value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    const customField = `custom${baseField.charAt(0).toUpperCase() + baseField.slice(1)}` as keyof Profile;
    const currentArray = (formData[customField] as string[]) || [];
    setFormData({ ...formData, [customField]: [...currentArray, value.trim()] });
    setter("");
  };

  const removeCustomItem = (field: keyof Profile, item: string) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData({ ...formData, [field]: currentArray.filter((i) => i !== item) });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <MobileHeader title="Profile" showActions={false} />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isEditing && profile) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <MobileHeader title="Profile" showActions={false} />
        
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <Card className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">{profile.name || "Your Profile"}</h2>
              <Button onClick={() => setIsEditing(true)} data-testid="button-edit">Edit</Button>
            </div>

            {profile.canHost && (
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="font-semibold text-primary">Can Host Travelers</p>
                {profile.maxCapacity && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum capacity: {profile.maxCapacity} {profile.maxCapacity === 1 ? "person" : "people"}
                  </p>
                )}
                {profile.maxDuration && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Max stay duration: {MAX_DURATION_OPTIONS.find(opt => opt.value === profile.maxDuration)?.label}
                  </p>
                )}
                {profile.preferredDays && profile.preferredDays.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Preferred days:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.preferredDays.map((day) => (
                        <Badge key={day} variant="secondary" className="text-xs">{day}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.customPreferredDays && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Other: {profile.customPreferredDays}
                  </p>
                )}
              </div>
            )}

            {profile.bio && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Bio</h3>
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            {profile.aboutMe && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">About Me</h3>
                <p className="text-sm text-muted-foreground">{profile.aboutMe}</p>
              </div>
            )}

            {profile.country && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Current Location</h3>
                <p className="text-sm text-muted-foreground">{profile.country}</p>
              </div>
            )}

            {profile.bornIn && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Born In</h3>
                <p className="text-sm text-muted-foreground">{profile.bornIn}</p>
              </div>
            )}

            {profile.previousLocations && profile.previousLocations.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Previous Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.previousLocations.map((location) => (
                    <Badge key={location} variant="outline">{location}</Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.languages && profile.languages.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <Badge key={lang} variant="outline">
                      <span className="mr-1">{getLanguageFlag(lang)}</span>
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.usualStayLength && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Usual Length of Stay</h3>
                <p className="text-sm text-muted-foreground">
                  {STAY_LENGTH_OPTIONS.find((opt) => opt.value === profile.usualStayLength)?.label}
                </p>
              </div>
            )}

            {profile.travelStyle && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Travel Style</h3>
                <p className="text-sm text-muted-foreground">
                  {TRAVEL_STYLE_OPTIONS.find((opt) => opt.value === profile.travelStyle)?.label}
                </p>
              </div>
            )}

            {profile.greenFlags && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Green Flags</h3>
                <p className="text-sm text-muted-foreground">{profile.greenFlags}</p>
              </div>
            )}

            {profile.redFlags && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Red Flags</h3>
                <p className="text-sm text-muted-foreground">{profile.redFlags}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <MobileHeader title="Edit Profile" showActions={false} />
      
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="p-6 space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-name"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
              data-testid="input-bio"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="about-me">About Me</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share your personality, travel philosophy, or what makes you unique</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              id="about-me"
              value={formData.aboutMe || ""}
              onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
              placeholder="Example: I'm a curious soul who believes the best travel stories happen when you get lost. I love connecting with locals over food, practicing my terrible language skills, and finding hidden gems off the tourist trail."
              rows={4}
              data-testid="input-about-me"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="can-host">Can Host Travelers</Label>
            </div>
            <Switch
              id="can-host"
              checked={formData.canHost || false}
              onCheckedChange={(checked) => setFormData({ ...formData, canHost: checked })}
              data-testid="switch-can-host"
            />
          </div>

          {formData.canHost && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="max-capacity">Maximum Capacity</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Highest amount of people you can host</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.maxCapacity?.toString() || ""}
                  onValueChange={(value) => setFormData({ ...formData, maxCapacity: parseInt(value) })}
                >
                  <SelectTrigger data-testid="select-max-capacity">
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                    <SelectItem value="6">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="max-duration">Maximum Duration</Label>
                <Select
                  value={formData.maxDuration || ""}
                  onValueChange={(value) => setFormData({ ...formData, maxDuration: value })}
                >
                  <SelectTrigger id="max-duration" data-testid="select-max-duration">
                    <SelectValue placeholder="How long can guests stay?" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAX_DURATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Preferred Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PREFERRED_DAYS_OPTIONS.map((day) => (
                    <Badge
                      key={day}
                      variant={(formData.preferredDays || []).includes(day) ? "default" : "outline"}
                      className="cursor-pointer hover-elevate active-elevate-2"
                      onClick={() => toggleArrayItem("preferredDays", day)}
                      data-testid={`badge-preferred-day-${day.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Other (write your own)"
                    value={newCustomPreferredDays}
                    onChange={(e) => setNewCustomPreferredDays(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newCustomPreferredDays.trim()) {
                        setFormData({
                          ...formData,
                          customPreferredDays: newCustomPreferredDays.trim()
                        });
                        setNewCustomPreferredDays("");
                      }
                    }}
                    data-testid="input-custom-preferred-days"
                  />
                </div>
                {formData.customPreferredDays && (
                  <Badge
                    variant="default"
                    className="mt-2 cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => setFormData({ ...formData, customPreferredDays: undefined })}
                    data-testid="badge-custom-preferred-days"
                  >
                    {formData.customPreferredDays}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
              </div>
            </>
          )}

          <div>
            <Label htmlFor="country">Current Country</Label>
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryOpen}
                  className="w-full justify-between"
                  data-testid="button-country"
                >
                  {formData.country || "Select country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Type at least 2 letters..."
                    value={countrySearch}
                    onValueChange={setCountrySearch}
                    data-testid="input-country-search"
                  />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    {countrySearch.length >= 2 && (
                      <CommandGroup>
                        {COUNTRIES.filter(country =>
                          country.toLowerCase().includes(countrySearch.toLowerCase())
                        ).map((country) => (
                          <CommandItem
                            key={country}
                            value={country}
                            onSelect={() => {
                              setFormData({ ...formData, country });
                              setCountryOpen(false);
                              setCountrySearch("");
                            }}
                            data-testid={`option-country-${country.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.country === country ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {country}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="born-in">Born In</Label>
            <Popover open={bornInOpen} onOpenChange={setBornInOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={bornInOpen}
                  className="w-full justify-between"
                  data-testid="button-born-in"
                >
                  {formData.bornIn || "Select city or country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Type at least 2 letters..."
                    value={bornInSearch}
                    onValueChange={setBornInSearch}
                    data-testid="input-born-in-search"
                  />
                  <CommandList>
                    <CommandEmpty>No location found.</CommandEmpty>
                    {bornInSearch.length >= 2 && (
                      <CommandGroup>
                        {COUNTRIES.filter(country =>
                          country.toLowerCase().includes(bornInSearch.toLowerCase())
                        ).map((country) => (
                          <CommandItem
                            key={country}
                            value={country}
                            onSelect={() => {
                              setFormData({ ...formData, bornIn: country });
                              setBornInOpen(false);
                              setBornInSearch("");
                            }}
                            data-testid={`option-born-in-${country.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.bornIn === country ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {country}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label>Where have you lived before?</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Helps others understand your background and connection to different places</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Popover open={previousLocationsOpen} onOpenChange={setPreviousLocationsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={previousLocationsOpen}
                  className="w-full justify-between"
                  data-testid="button-previous-locations"
                >
                  {(formData.previousLocations || []).length > 0
                    ? `${formData.previousLocations!.length} selected`
                    : "Select locations..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Type at least 2 letters..."
                    value={previousLocationsSearch}
                    onValueChange={setPreviousLocationsSearch}
                    data-testid="input-previous-locations-search"
                  />
                  <CommandList>
                    <CommandEmpty>No location found.</CommandEmpty>
                    {previousLocationsSearch.length >= 2 && (
                      <CommandGroup>
                        {COUNTRIES.filter(country =>
                          country.toLowerCase().includes(previousLocationsSearch.toLowerCase())
                        ).map((country) => {
                          const isSelected = (formData.previousLocations || []).includes(country);
                          return (
                            <CommandItem
                              key={country}
                              value={country}
                              onSelect={() => {
                                toggleArrayItem("previousLocations", country);
                              }}
                              data-testid={`option-previous-location-${country.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {country}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {(formData.previousLocations || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.previousLocations!.map((location) => (
                  <Badge
                    key={location}
                    variant="default"
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => toggleArrayItem("previousLocations", location)}
                    data-testid={`badge-previous-location-${location.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {location}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Languages</Label>
            <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={languageOpen}
                  className="w-full justify-between"
                  data-testid="button-languages"
                >
                  {(formData.languages || []).length > 0
                    ? `${formData.languages!.length} selected`
                    : "Select languages..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Type at least 2 letters..."
                    value={languageSearch}
                    onValueChange={setLanguageSearch}
                    data-testid="input-language-search"
                  />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    {languageSearch.length >= 2 && (
                      <CommandGroup>
                        {LANGUAGES.filter(lang =>
                          lang.name.toLowerCase().includes(languageSearch.toLowerCase())
                        ).map((lang) => {
                          const isSelected = (formData.languages || []).includes(lang.name);
                          return (
                            <CommandItem
                              key={lang.name}
                              value={lang.name}
                              onSelect={() => {
                                toggleArrayItem("languages", lang.name);
                              }}
                              data-testid={`option-language-${lang.name.toLowerCase()}`}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span className="mr-2">{lang.flag}</span>
                              {lang.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {(formData.languages || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages!.map((lang) => (
                  <Badge
                    key={lang}
                    variant="default"
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => toggleArrayItem("languages", lang)}
                    data-testid={`badge-language-${lang.toLowerCase()}`}
                  >
                    <span className="mr-1">{getLanguageFlag(lang)}</span>
                    {lang}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {INTEREST_OPTIONS.map((interest) => (
                <Badge
                  key={interest}
                  variant={(formData.interests || []).includes(interest) ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => toggleArrayItem("interests", interest)}
                  data-testid={`badge-interest-${interest.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="stay-length">How long do you usually stay in one place?</Label>
            <Select
              value={formData.usualStayLength || ""}
              onValueChange={(value) => setFormData({ ...formData, usualStayLength: value })}
            >
              <SelectTrigger id="stay-length" data-testid="select-stay-length">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {STAY_LENGTH_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="travel-style">Travel Style</Label>
            <Select
              value={formData.travelStyle || ""}
              onValueChange={(value) => setFormData({ ...formData, travelStyle: value })}
            >
              <SelectTrigger id="travel-style" data-testid="select-travel-style">
                <SelectValue placeholder="Select your style" />
              </SelectTrigger>
              <SelectContent>
                {TRAVEL_STYLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.desc}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Availability Dates</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="availability-flexible" className="text-sm font-normal">
                  Flexible / Up to agreement
                </Label>
                <Switch
                  id="availability-flexible"
                  checked={formData.availabilityFlexible || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, availabilityFlexible: checked })}
                  data-testid="switch-availability-flexible"
                />
              </div>
            </div>
            
            {!formData.availabilityFlexible && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="from" className="text-xs">From</Label>
                  <Input
                    id="from"
                    type="date"
                    value={formData.availabilityFrom || ""}
                    onChange={(e) => setFormData({ ...formData, availabilityFrom: e.target.value })}
                    data-testid="input-availability-from"
                  />
                </div>
                <div>
                  <Label htmlFor="to" className="text-xs">To</Label>
                  <Input
                    id="to"
                    type="date"
                    value={formData.availabilityTo || ""}
                    onChange={(e) => setFormData({ ...formData, availabilityTo: e.target.value })}
                    data-testid="input-availability-to"
                  />
                </div>
                <div>
                  <Label htmlFor="days" className="text-xs">Days (1-30)</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.availabilityDays || ""}
                    onChange={(e) => setFormData({ ...formData, availabilityDays: parseInt(e.target.value) })}
                    data-testid="input-availability-days"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Label>Preferred Transport Options</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TRANSPORT_OPTIONS.map((transport) => (
                <Badge
                  key={transport}
                  variant={(formData.preferredTransport || []).includes(transport) ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => toggleArrayItem("preferredTransport", transport)}
                  data-testid={`badge-transport-${transport.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {transport}
                </Badge>
              ))}
              {(formData.customTransport || []).map((custom) => (
                <Badge
                  key={custom}
                  variant="default"
                  className="cursor-pointer"
                  data-testid={`badge-custom-transport-${custom.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {custom}
                  <X
                    className="h-3 w-3 ml-1"
                    onClick={() => removeCustomItem("customTransport", custom)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add your own..."
                value={newCustomTransport}
                onChange={(e) => setNewCustomTransport(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addCustomItem("transport", newCustomTransport, setNewCustomTransport);
                  }
                }}
                data-testid="input-custom-transport"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => addCustomItem("transport", newCustomTransport, setNewCustomTransport)}
                data-testid="button-add-transport"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Preferred Type of Stay</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {STAY_TYPE_OPTIONS.map((stay) => (
                <Badge
                  key={stay}
                  variant={(formData.preferredStay || []).includes(stay) ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => toggleArrayItem("preferredStay", stay)}
                  data-testid={`badge-stay-${stay.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {stay}
                </Badge>
              ))}
              {(formData.customStay || []).map((custom) => (
                <Badge
                  key={custom}
                  variant="default"
                  className="cursor-pointer"
                  data-testid={`badge-custom-stay-${custom.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {custom}
                  <X
                    className="h-3 w-3 ml-1"
                    onClick={() => removeCustomItem("customStay", custom)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add your own..."
                value={newCustomStay}
                onChange={(e) => setNewCustomStay(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addCustomItem("stay", newCustomStay, setNewCustomStay);
                  }
                }}
                data-testid="input-custom-stay"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => addCustomItem("stay", newCustomStay, setNewCustomStay)}
                data-testid="button-add-stay"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Preferred Things to Do</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ACTIVITY_OPTIONS.map((activity) => (
                <Badge
                  key={activity}
                  variant={(formData.preferredActivities || []).includes(activity) ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => toggleArrayItem("preferredActivities", activity)}
                  data-testid={`badge-activity-${activity.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {activity}
                </Badge>
              ))}
              {(formData.customActivities || []).map((custom) => (
                <Badge
                  key={custom}
                  variant="default"
                  className="cursor-pointer"
                  data-testid={`badge-custom-activity-${custom.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {custom}
                  <X
                    className="h-3 w-3 ml-1"
                    onClick={() => removeCustomItem("customActivities", custom)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add your own..."
                value={newCustomActivity}
                onChange={(e) => setNewCustomActivity(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addCustomItem("activities", newCustomActivity, setNewCustomActivity);
                  }
                }}
                data-testid="input-custom-activity"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => addCustomItem("activities", newCustomActivity, setNewCustomActivity)}
                data-testid="button-add-activity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="green-flags">Traveling Green Flags</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Tell us what you really enjoy when you travel. This helps other people know your style and find the right match.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              id="green-flags"
              value={formData.greenFlags || ""}
              onChange={(e) => setFormData({ ...formData, greenFlags: e.target.value })}
              placeholder="e.g., I love exploring local food markets, wandering hidden streets, and spending time by the sea."
              rows={3}
              data-testid="input-green-flags"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="red-flags">Traveling Red Flags</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Tell us what really isn't your thing when you travel. This helps other people know your style and avoid mismatches.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              id="red-flags"
              value={formData.redFlags || ""}
              onChange={(e) => setFormData({ ...formData, redFlags: e.target.value })}
              placeholder="e.g., I don't enjoy nightlife or late nights out and I'm not a fan of long hikes."
              rows={3}
              data-testid="input-red-flags"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
              data-testid="button-save"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
            {profile && (
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
