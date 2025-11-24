import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Bus, Clock, MapPin, Route as RouteIcon, IndianRupee, Repeat, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ChatbotPanel from "@/components/ChatbotPanel";

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

interface RouteStop {
  stopId: string;
  order: number;
  arrivalTime: string;
  departureTime: string;
  stopName?: string;
}

interface RouteSegment {
  routeName: string;
  busNumber: string;
  busType: string;
  direction?: string;
  from: string;
  to: string;
  distance: number;
  fare: number;
  departureTime: string;
  arrivalTime: string;
}

interface Stop {
  id: string;
  name: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  facilities?: string[];
  routeCount?: number;
  servingRoutes?: Array<{
    routeId: string;
    routeName: string;
    busNumber: string;
    busType: string;
    frequency: string;
  }>;
}

interface RouteResult {
  type: string;
  routeName?: string;
  busNumber?: string;
  busType?: string;
  direction?: string;
  distance?: number;
  duration?: string;
  totalFare?: number;
  frequency?: string;
  departureTime?: string;
  arrivalTime?: string;
  amenities?: string[];
  stops?: RouteStop[];
  segments?: RouteSegment[];
  transferPoint?: string;
  waitTime?: string;
  totalDistance?: number;
  totalDuration?: string;
}

const Routes = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [fromStop, setFromStop] = useState<Stop | null>(null);
  const [toStop, setToStop] = useState<Stop | null>(null);
  const [availableStops, setAvailableStops] = useState<Stop[]>([]);
  const [loadingStops, setLoadingStops] = useState(true);
  const { toast } = useToast();

  // Load available stops on component mount
  useEffect(() => {
    const loadStops = async () => {
      try {
        const response = await fetch(`${API_URL}/routes/stops`);
        const data = await response.json();
        
        if (response.ok && data.stops) {
          setAvailableStops(data.stops);
        }
      } catch (error) {
        console.error('Failed to load stops:', error);
      } finally {
        setLoadingStops(false);
      }
    };

    loadStops();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!from || !to) {
      toast({
        title: "Missing information",
        description: "Please enter both source and destination",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/routes/find?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );

      const data = await response.json();

      if (response.ok) {
        setRoutes(data.routes || []);
        setFromStop(data.from);
        setToStop(data.to);
        
        if (data.routes && data.routes.length > 0) {
          toast({
            title: "Routes found!",
            description: `Found ${data.totalRoutes} route(s) from ${data.from.name} to ${data.to.name}`,
          });
        } else {
          toast({
            title: "No routes found",
            description: "Try different locations or check spelling",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Search failed",
          description: data.error || "Unable to find routes",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Navbar />
      <ChatbotPanel />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <RouteIcon className="h-8 w-8 text-primary" />
            Find Bus Routes
          </h1>
          <p className="text-muted-foreground">
            Search for the best bus routes between any two locations in Mangalore-Udupi region
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Routes</CardTitle>
            <CardDescription>Enter your source and destination</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Select value={from} onValueChange={setFrom} required disabled={loadingStops}>
                    <SelectTrigger id="from">
                      <SelectValue placeholder={loadingStops ? "Loading stops..." : "Select source location"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStops.map((stop) => (
                        <SelectItem key={stop.id} value={stop.name}>
                          <div className="flex flex-col">
                            <span>{stop.name}</span>
                            <span className="text-xs text-muted-foreground">{stop.location} • {stop.routeCount} routes</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Select value={to} onValueChange={setTo} required disabled={loadingStops}>
                    <SelectTrigger id="to">
                      <SelectValue placeholder={loadingStops ? "Loading stops..." : "Select destination"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStops.map((stop) => (
                        <SelectItem key={stop.id} value={stop.name}>
                          <div className="flex flex-col">
                            <span>{stop.name}</span>
                            <span className="text-xs text-muted-foreground">{stop.location} • {stop.routeCount} routes</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full" variant="hero" disabled={isLoading}>
                {isLoading ? "Searching..." : "Search Routes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {routes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Available Routes ({routes.length})
              </h2>
              <div className="text-sm text-muted-foreground">
                From <span className="font-semibold">{fromStop?.name}</span> to{" "}
                <span className="font-semibold">{toStop?.name}</span>
              </div>
            </div>

            {routes.map((route, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {route.type === "direct" ? (
                    // Direct Route
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default" className="bg-green-500">Direct</Badge>
                            <Badge variant="outline">{route.busType}</Badge>
                            {route.direction && (
                              <Badge variant="secondary" className="text-xs">
                                {route.direction === 'forward' ? '→' : '←'} {route.direction}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold mb-1">{route.routeName}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Bus className="h-4 w-4" />
                            Bus: {route.busNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary flex items-center">
                            <IndianRupee className="h-5 w-5" />
                            {route.totalFare}
                          </div>
                          <p className="text-sm text-muted-foreground">{route.distance} km</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{route.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Repeat className="h-4 w-4 text-muted-foreground" />
                          <span>{route.frequency}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-md">
                        <span className="font-medium">{route.departureTime}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{route.arrivalTime}</span>
                      </div>

                      {route.amenities && route.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {route.amenities.map((amenity, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Transfer Route
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default" className="bg-orange-500">1 Transfer</Badge>
                            <Badge variant="outline">at {route.transferPoint}</Badge>
                            {route.waitTime && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Wait: {route.waitTime}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold">Multi-segment Journey</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary flex items-center">
                            <IndianRupee className="h-5 w-5" />
                            {route.totalFare}
                          </div>
                          <p className="text-sm text-muted-foreground">{route.totalDistance} km</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {route.segments?.map((segment, i) => (
                          <div key={i} className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{segment.routeName}</p>
                                  {segment.direction && (
                                    <Badge variant="secondary" className="text-xs">
                                      {segment.direction === 'forward' ? '→' : '←'}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Bus: {segment.busNumber} ({segment.busType})
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold flex items-center">
                                  <IndianRupee className="h-4 w-4" />
                                  {segment.fare}
                                </p>
                                <p className="text-sm text-muted-foreground">{segment.distance} km</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span>{segment.from}</span>
                              <ArrowRight className="h-4 w-4" />
                              <span>{segment.to}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {segment.departureTime} - {segment.arrivalTime}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md text-sm">
                        <p className="font-medium text-amber-900 dark:text-amber-100">
                          ⚠️ Transfer at {route.transferPoint}
                        </p>
                        <p className="text-amber-700 dark:text-amber-200 text-xs mt-1">
                          Total journey time: {route.totalDuration}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No results message */}
        {!isLoading && routes.length === 0 && from && to && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No routes found</h3>
              <p className="text-muted-foreground">
                Try searching with different locations or check your spelling
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Routes;
