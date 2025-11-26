import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Loader2 } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

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
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'host' | 'traveler'>('all');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const filteredMarkers = filterType === 'all' 
    ? mockMarkers 
    : mockMarkers.filter(m => m.type === filterType);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.log("Google Maps API key not configured, using fallback view");
        setMapLoaded(true);
        return;
      }

      try {
        const loader = new Loader({
          apiKey,
          version: "weekly",
        });

        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement } = await loader.importLibrary("marker");

        const map = new Map(mapRef.current, {
          zoom: 3,
          center: { lat: 20, lng: 0 },
          mapId: "FEMME_PACKER_MAP",
        });

        mapInstance.current = map;

        filteredMarkers.forEach((marker) => {
          const markerView = document.createElement("div");
          markerView.className = `w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer ${
            marker.type === 'host' ? 'bg-blue-600' : 'bg-cyan-600'
          }`;
          markerView.innerHTML = '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>';
          markerView.onclick = () => setSelectedMarker(marker);

          new AdvancedMarkerElement({
            map,
            position: { lat: marker.lat, lng: marker.lng },
            content: markerView,
          });
        });

        setMapLoaded(true);
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
        setMapLoaded(true);
      }
    };

    initMap();
  }, [filteredMarkers]);

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

        <div 
          ref={mapRef}
          className="relative bg-muted rounded-lg overflow-hidden" 
          style={{ height: '500px' }}
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
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
