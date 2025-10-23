import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter } from "lucide-react";

interface MapMarker {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  type: 'host' | 'traveler';
  interests: string[];
}

const mockMarkers: MapMarker[] = [
  { id: '1', name: 'Sofia Martinez', location: 'Barcelona, Spain', lat: 41.3851, lng: 2.1734, type: 'host', interests: ['Art', 'Food'] },
  { id: '2', name: 'Emma Johnson', location: 'London, UK', lat: 51.5074, lng: -0.1278, type: 'host', interests: ['History', 'Music'] },
  { id: '3', name: 'Yuki Tanaka', location: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, type: 'traveler', interests: ['Culture', 'Food'] },
  { id: '4', name: 'Maya Patel', location: 'Mumbai, India', lat: 19.0760, lng: 72.8777, type: 'host', interests: ['Yoga', 'Adventure'] },
  { id: '5', name: 'Ana Silva', location: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729, type: 'traveler', interests: ['Beach', 'Music'] },
];

export function InteractiveMap() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'host' | 'traveler'>('all');

  const filteredMarkers = filterType === 'all' 
    ? mockMarkers 
    : mockMarkers.filter(m => m.type === filterType);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Explore Members</h2>
          <div className="flex gap-2">
            <Button 
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              data-testid="button-filter-all"
            >
              All
            </Button>
            <Button 
              variant={filterType === 'host' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('host')}
              data-testid="button-filter-hosts"
            >
              Hosts
            </Button>
            <Button 
              variant={filterType === 'traveler' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('traveler')}
              data-testid="button-filter-travelers"
            >
              Travelers
            </Button>
          </div>
        </div>

        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: '500px' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="h-16 w-16 text-primary mx-auto" />
                <p className="text-muted-foreground">
                  Interactive map visualization
                  <br />
                  <span className="text-xs">Click markers below to explore members</span>
                </p>
              </div>
            </div>
          </div>

          {filteredMarkers.map((marker, index) => (
            <div
              key={marker.id}
              className="absolute cursor-pointer hover-elevate"
              style={{
                left: `${20 + (index * 15) % 70}%`,
                top: `${20 + (index * 20) % 60}%`,
              }}
              onClick={() => setSelectedMarker(marker)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                marker.type === 'host' ? 'bg-primary' : 'bg-chart-2'
              }`}>
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">Member Details</h3>
        </div>

        {selectedMarker ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-lg text-foreground">{selectedMarker.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedMarker.location}</p>
              <Badge variant="secondary" className="mt-2">
                {selectedMarker.type === 'host' ? 'Host' : 'Traveler'}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {selectedMarker.interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="w-full" data-testid="button-view-profile">
              View Full Profile
            </Button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Click on a marker to view member details
          </div>
        )}
      </Card>
    </div>
  );
}
