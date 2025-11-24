import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hotel, Hospital, Landmark, UtensilsCrossed, MapPin, Phone, Clock, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import ChatbotPanel from "@/components/ChatbotPanel";

interface Place {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  distance: string;
  timing?: string;
  amenities?: string[];
  type: string;
}

const LODGES: Place[] = [
  {
    id: "1",
    name: "Hotel Moti Mahal",
    address: "Hampankatta, Mangalore",
    phone: "+91 824 425 3555",
    rating: 4.2,
    distance: "0.2 km from Bus Stand",
    timing: "24/7",
    amenities: ["AC Rooms", "Restaurant", "Room Service", "Parking"],
    type: "lodge"
  },
  {
    id: "2",
    name: "Hotel Ayodhya",
    address: "Bunts Hostel Road, Mangalore",
    phone: "+91 824 242 3421",
    rating: 4.0,
    distance: "0.8 km from Bus Stand",
    timing: "24/7",
    amenities: ["Free WiFi", "Restaurant", "Laundry", "Travel Desk"],
    type: "lodge"
  },
  {
    id: "3",
    name: "Deepa Comforts",
    address: "Car Street, Mangalore",
    phone: "+91 824 242 4488",
    rating: 4.1,
    distance: "0.3 km from Bus Stand",
    timing: "24/7",
    amenities: ["AC Rooms", "Restaurant", "Free Breakfast", "WiFi"],
    type: "lodge"
  },
  {
    id: "4",
    name: "Hotel Prabhu",
    address: "Hampankatta, Mangalore",
    phone: "+91 824 425 4466",
    rating: 3.8,
    distance: "0.4 km from Bus Stand",
    timing: "24/7",
    amenities: ["Budget Friendly", "Restaurant", "Room Service"],
    type: "lodge"
  },
  {
    id: "5",
    name: "Hotel Navaratna Palace",
    address: "Balmatta Road, Mangalore",
    phone: "+91 824 244 2244",
    rating: 4.3,
    distance: "0.6 km from Bus Stand",
    timing: "24/7",
    amenities: ["AC/Non-AC Rooms", "Restaurant", "Conference Hall"],
    type: "lodge"
  },
  {
    id: "6",
    name: "The Taj Mahal Hotel",
    address: "Bunder, Mangalore",
    phone: "+91 824 244 5566",
    rating: 4.0,
    distance: "1.2 km from Bus Stand",
    timing: "24/7",
    amenities: ["Sea View", "Restaurant", "Bar", "Parking"],
    type: "lodge"
  },
  {
    id: "7",
    name: "Hotel Surya",
    address: "Court Road, Mangalore",
    phone: "+91 824 244 7788",
    rating: 3.9,
    distance: "0.7 km from Bus Stand",
    timing: "24/7",
    amenities: ["Budget Rooms", "Restaurant", "Travel Services"],
    type: "lodge"
  },
  {
    id: "8",
    name: "Hotel Poonja International",
    address: "K.S. Rao Road, Mangalore",
    phone: "+91 824 442 7171",
    rating: 4.5,
    distance: "1.5 km from Bus Stand",
    timing: "24/7",
    amenities: ["Luxury Rooms", "Multi-cuisine Restaurant", "Swimming Pool"],
    type: "lodge"
  }
];

const HOSPITALS: Place[] = [
  {
    id: "1",
    name: "KMC Hospital",
    address: "Ambedkar Circle, Mangalore",
    phone: "+91 824 242 1000",
    rating: 4.5,
    distance: "1.5 km from KSRTC",
    timing: "24/7 Emergency",
    amenities: ["Emergency", "ICU", "Pharmacy", "Ambulance"],
    type: "hospital"
  },
  {
    id: "2",
    name: "Manipal Hospital",
    address: "Madhav Nagar, Manipal",
    phone: "+91 820 257 1201",
    rating: 4.6,
    distance: "Near Manipal MIT",
    timing: "24/7 Emergency",
    amenities: ["Multi-Specialty", "ICU", "Pharmacy", "Blood Bank"],
    type: "hospital"
  },
  {
    id: "3",
    name: "AJ Hospital",
    address: "Kuntikana, Mangalore",
    phone: "+91 824 242 5555",
    rating: 4.4,
    distance: "2.0 km from KSRTC",
    timing: "24/7 Emergency",
    amenities: ["Emergency", "Surgery", "Lab", "Ambulance"],
    type: "hospital"
  },
  {
    id: "4",
    name: "Dr. TMA Pai Hospital",
    address: "Udupi",
    phone: "+91 820 252 0187",
    rating: 4.3,
    distance: "0.8 km from Udupi Bus Stand",
    timing: "24/7 Emergency",
    amenities: ["Emergency", "Cardiology", "Pharmacy"],
    type: "hospital"
  },
  {
    id: "5",
    name: "Father Muller Medical College",
    address: "Kankanady, Mangalore",
    phone: "+91 824 223 8000",
    rating: 4.5,
    distance: "3.0 km from KSRTC",
    timing: "24/7 Emergency",
    amenities: ["Teaching Hospital", "All Specialties", "Research"],
    type: "hospital"
  },
  {
    id: "6",
    name: "Unity Hospital",
    address: "Deralakatte, Mangalore",
    phone: "+91 824 246 7890",
    rating: 4.2,
    distance: "4.0 km from KSRTC",
    timing: "24/7 Emergency",
    amenities: ["Multi-Specialty", "Dialysis", "Maternity"],
    type: "hospital"
  },
  {
    id: "7",
    name: "Wenlock Hospital",
    address: "Hampankatta, Mangalore",
    phone: "+91 824 242 4242",
    rating: 4.0,
    distance: "0.8 km from KSRTC",
    timing: "24/7 Emergency",
    amenities: ["Government Hospital", "Emergency", "Free Treatment"],
    type: "hospital"
  },
  {
    id: "8",
    name: "Kasturba Medical College Hospital",
    address: "Light House Hill, Mangalore",
    phone: "+91 824 242 2271",
    rating: 4.4,
    distance: "2.5 km from KSRTC",
    timing: "24/7 Emergency",
    amenities: ["Teaching Hospital", "Research", "All Specialties"],
    type: "hospital"
  },
  {
    id: "9",
    name: "District Hospital Puttur",
    address: "Puttur Town",
    phone: "+91 825 425 6677",
    rating: 3.8,
    distance: "0.5 km from Puttur Bus Stand",
    timing: "24/7 Emergency",
    amenities: ["Government Hospital", "Basic Healthcare", "Emergency"],
    type: "hospital"
  },
  {
    id: "10",
    name: "Bantwal Taluk Hospital",
    address: "Bantwal",
    phone: "+91 824 527 2233",
    rating: 3.7,
    distance: "0.3 km from Bantwal Bus Stand",
    timing: "24/7 Emergency",
    amenities: ["Government Hospital", "Basic Healthcare", "Maternity"],
    type: "hospital"
  }
];

const BANKS: Place[] = [
  {
    id: "1",
    name: "State Bank of India - Hampankatta",
    address: "Hampankatta Circle, Mangalore",
    phone: "+91 824 242 0401",
    rating: 4.0,
    distance: "0.2 km from KSRTC",
    timing: "10:00 AM - 4:00 PM",
    amenities: ["ATM 24/7", "Deposit", "Withdrawal", "UPI"],
    type: "bank"
  },
  {
    id: "2",
    name: "HDFC Bank - Udupi",
    address: "Service Bus Stand, Udupi",
    phone: "+91 820 252 1234",
    rating: 4.1,
    distance: "0.1 km from Udupi Bus Stand",
    timing: "10:00 AM - 4:00 PM",
    amenities: ["ATM 24/7", "Locker", "Cards", "Net Banking"],
    type: "bank"
  },
  {
    id: "3",
    name: "Canara Bank - Manipal",
    address: "MIT Road, Manipal",
    phone: "+91 820 257 0234",
    rating: 4.2,
    distance: "Near Manipal MIT",
    timing: "10:00 AM - 5:00 PM",
    amenities: ["ATM 24/7", "Student Accounts", "Mobile Banking"],
    type: "bank"
  },
  {
    id: "4",
    name: "ICICI Bank - Pumpwell",
    address: "Pumpwell Circle, Mangalore",
    phone: "+91 824 244 5566",
    rating: 4.0,
    distance: "Near Pumpwell",
    timing: "10:00 AM - 5:00 PM",
    amenities: ["ATM 24/7", "Personal Loans", "Credit Cards"],
    type: "bank"
  },
  {
    id: "5",
    name: "Axis Bank - Kadri",
    address: "Kadri Temple Road, Mangalore",
    phone: "+91 824 242 8899",
    rating: 3.9,
    distance: "Near Kadri Temple",
    timing: "10:00 AM - 4:00 PM",
    amenities: ["ATM 24/7", "Forex", "Insurance"],
    type: "bank"
  },
  {
    id: "6",
    name: "Syndicate Bank - Car Street",
    address: "Car Street, Mangalore",
    phone: "+91 824 242 5432",
    rating: 4.0,
    distance: "1.0 km from KSRTC",
    timing: "10:00 AM - 4:00 PM",
    amenities: ["ATM 24/7", "Senior Citizen Services", "Pension"],
    type: "bank"
  },
  {
    id: "7",
    name: "Kotak Mahindra Bank - Manipal",
    address: "Tiger Circle, Manipal",
    phone: "+91 820 257 8765",
    rating: 4.1,
    distance: "0.3 km from Manipal MIT",
    timing: "10:00 AM - 5:00 PM",
    amenities: ["ATM 24/7", "Digital Banking", "Investment Services"],
    type: "bank"
  },
  {
    id: "8",
    name: "Indian Bank - Puttur",
    address: "Main Road, Puttur",
    phone: "+91 825 425 3456",
    rating: 3.8,
    distance: "0.2 km from Puttur Bus Stand",
    timing: "10:00 AM - 4:00 PM",
    amenities: ["ATM 24/7", "Rural Banking", "Self Help Groups"],
    type: "bank"
  },
  {
    id: "9",
    name: "Corporation Bank - Bantwal",
    address: "BC Road, Bantwal",
    phone: "+91 824 527 4567",
    rating: 3.9,
    distance: "0.1 km from Bantwal Bus Stand",
    timing: "10:00 AM - 4:00 PM",
    amenities: ["ATM 24/7", "Agricultural Loans", "Business Banking"],
    type: "bank"
  },
  {
    id: "10",
    name: "Federal Bank - Karkala",
    address: "Karkala Town",
    phone: "+91 825 452 7890",
    rating: 4.0,
    distance: "Near Karkala Bus Stand",
    timing: "10:00 AM - 4:00 PM",
    amenities: ["ATM 24/7", "NRI Services", "Gold Loan"],
    type: "bank"
  },
  {
    id: "11",
    name: "Punjab National Bank - Surathkal",
    address: "NITK Campus, Surathkal",
    phone: "+91 824 247 5678",
    rating: 4.0,
    distance: "Near NITK Campus",
    timing: "10:00 AM - 4:00 PM",
    amenities: ["ATM 24/7", "Student Banking", "Education Loans"],
    type: "bank"
  },
  {
    id: "12",
    name: "Karnataka Bank - Udupi",
    address: "Diana Circle, Udupi",
    phone: "+91 820 252 6789",
    rating: 4.2,
    distance: "0.5 km from Udupi Bus Stand",
    timing: "10:00 AM - 5:00 PM",
    amenities: ["ATM 24/7", "Local Banking", "Micro Finance"],
    type: "bank"
  }
];

const RESTAURANTS: Place[] = [
  {
    id: "1",
    name: "Giri Manja's",
    address: "Balmatta Road, Mangalore",
    phone: "+91 824 244 1234",
    rating: 4.5,
    distance: "0.8 km from KSRTC",
    timing: "11:00 AM - 11:00 PM",
    amenities: ["Seafood", "Mangalorean Cuisine", "AC", "Parking"],
    type: "restaurant"
  },
  {
    id: "2",
    name: "Mitra Samaj",
    address: "Car Street, Udupi",
    phone: "+91 820 252 0111",
    rating: 4.6,
    distance: "0.5 km from Udupi Bus Stand",
    timing: "7:00 AM - 9:30 PM",
    amenities: ["South Indian", "Vegetarian", "Budget-Friendly"],
    type: "restaurant"
  },
  {
    id: "3",
    name: "Dollops",
    address: "Manipal",
    phone: "+91 820 257 3333",
    rating: 4.4,
    distance: "Near Manipal MIT",
    timing: "11:00 AM - 11:00 PM",
    amenities: ["Continental", "Chinese", "Desserts", "Cafe"],
    type: "restaurant"
  },
  {
    id: "4",
    name: "Ideal Ice Cream",
    address: "Car Street, Mangalore",
    phone: "+91 824 244 0987",
    rating: 4.7,
    distance: "1.0 km from KSRTC",
    timing: "10:00 AM - 10:00 PM",
    amenities: ["Ice Cream", "Desserts", "Family-Friendly"],
    type: "restaurant"
  },
  {
    id: "5",
    name: "Woodlands Restaurant",
    address: "Udupi",
    phone: "+91 820 252 2345",
    rating: 4.3,
    distance: "0.3 km from Udupi Bus Stand",
    timing: "7:00 AM - 10:00 PM",
    amenities: ["South Indian", "North Indian", "Vegetarian", "AC"],
    type: "restaurant"
  },
  {
    id: "6",
    name: "The Coral",
    address: "Malpe Beach",
    phone: "+91 820 253 4567",
    rating: 4.5,
    distance: "Near Malpe Beach",
    timing: "11:00 AM - 11:00 PM",
    amenities: ["Seafood", "Beach View", "Bar", "Live Music"],
    type: "restaurant"
  },
  {
    id: "7",
    name: "Hotel Janatha",
    address: "Kundapura",
    phone: "+91 820 254 1234",
    rating: 4.2,
    distance: "Near Kundapura Bus Stand",
    timing: "6:00 AM - 10:00 PM",
    amenities: ["Local Cuisine", "Fish Curry", "Budget Meals"],
    type: "restaurant"
  },
  {
    id: "8",
    name: "Sagar Ratna",
    address: "Hampankatta, Mangalore",
    phone: "+91 824 242 3456",
    rating: 4.1,
    distance: "0.3 km from KSRTC",
    timing: "8:00 AM - 10:30 PM",
    amenities: ["South Indian", "Fast Service", "Clean"],
    type: "restaurant"
  },
  {
    id: "9",
    name: "Paarijaatha",
    address: "Kankanady, Mangalore",
    phone: "+91 824 246 7890",
    rating: 4.3,
    distance: "2.5 km from KSRTC",
    timing: "11:00 AM - 11:00 PM",
    amenities: ["Fine Dining", "Multi-Cuisine", "Family Restaurant"],
    type: "restaurant"
  },
  {
    id: "10",
    name: "Shree Krishna Inn",
    address: "Car Street, Udupi",
    phone: "+91 820 252 4567",
    rating: 4.4,
    distance: "0.2 km from Udupi Bus Stand",
    timing: "6:00 AM - 9:00 PM",
    amenities: ["Pure Vegetarian", "Traditional", "Temple Food"],
    type: "restaurant"
  },
  {
    id: "11",
    name: "Coastal Curry",
    address: "Karkala",
    phone: "+91 825 452 3456",
    rating: 4.0,
    distance: "Near Karkala Bus Stand",
    timing: "11:00 AM - 9:00 PM",
    amenities: ["Coastal Cuisine", "Spicy Food", "Local Favorite"],
    type: "restaurant"
  },
  {
    id: "12",
    name: "MTR - Mavalli Tiffin Room",
    address: "Lalbagh Road, Mangalore",
    phone: "+91 824 244 5678",
    rating: 4.5,
    distance: "1.5 km from KSRTC",
    timing: "6:30 AM - 8:30 PM",
    amenities: ["Authentic South Indian", "Breakfast Specialist", "Traditional"],
    type: "restaurant"
  },
  {
    id: "13",
    name: "Fish Factory",
    address: "Surathkal Beach",
    phone: "+91 824 247 8901",
    rating: 4.2,
    distance: "Near Surathkal Beach",
    timing: "12:00 PM - 10:00 PM",
    amenities: ["Fresh Seafood", "Beach Side", "Mangalorean Style"],
    type: "restaurant"
  },
  {
    id: "14",
    name: "Hotel Rajdhani",
    address: "Puttur",
    phone: "+91 825 425 7890",
    rating: 3.9,
    distance: "0.1 km from Puttur Bus Stand",
    timing: "7:00 AM - 9:30 PM",
    amenities: ["Gujarati Thali", "Vegetarian", "Unlimited Meals"],
    type: "restaurant"
  }
];

const Places = () => {
  const [activeTab, setActiveTab] = useState("lodges");

  const renderPlaceCard = (place: Place) => {
    const getIcon = () => {
      switch (place.type) {
        case "lodge":
          return <Hotel className="h-5 w-5 text-primary" />;
        case "hospital":
          return <Hospital className="h-5 w-5 text-primary" />;
        case "bank":
          return <Landmark className="h-5 w-5 text-primary" />;
        case "restaurant":
          return <UtensilsCrossed className="h-5 w-5 text-primary" />;
        default:
          return <MapPin className="h-5 w-5 text-primary" />;
      }
    };

    return (
      <Card key={place.id} className="hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                {getIcon()}
              </div>
              <div>
                <CardTitle className="text-lg">{place.name}</CardTitle>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{place.rating}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary">{place.distance}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{place.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{place.phone}</span>
          </div>
          {place.timing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{place.timing}</span>
            </div>
          )}
          {place.amenities && place.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {place.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}
          <Button variant="hero" className="w-full mt-4">
            Get Directions
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Navbar />
      <ChatbotPanel />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            Find Nearby Places
          </h1>
          <p className="text-muted-foreground">
            Discover accommodations, hospitals, banks, and restaurants along your route
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="lodges" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              <span className="hidden sm:inline">Lodges</span>
            </TabsTrigger>
            <TabsTrigger value="hospitals" className="flex items-center gap-2">
              <Hospital className="h-4 w-4" />
              <span className="hidden sm:inline">Hospitals</span>
            </TabsTrigger>
            <TabsTrigger value="banks" className="flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              <span className="hidden sm:inline">ATMs/Banks</span>
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">Restaurants</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lodges">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LODGES.map((place) => renderPlaceCard(place))}
            </div>
          </TabsContent>

          <TabsContent value="hospitals">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {HOSPITALS.map((place) => renderPlaceCard(place))}
            </div>
          </TabsContent>

          <TabsContent value="banks">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BANKS.map((place) => renderPlaceCard(place))}
            </div>
          </TabsContent>

          <TabsContent value="restaurants">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESTAURANTS.map((place) => renderPlaceCard(place))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Places;
