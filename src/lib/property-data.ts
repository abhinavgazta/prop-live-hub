// Hardcoded property data for discover page
export interface Property {
  id: string;
  title: string;
  developer: string;
  location: string;
  sector: string;
  city: string;
  lat: number;
  lng: number;
  type: "live" | "upcoming" | "property";
  propertyType: "3BHK" | "4BHK" | "Villa" | "Plot" | "2BHK";
  price: number; // in crores
  priceDisplay: string;
  size?: string;
  viewers?: number;
  status: "ready-to-move" | "under-construction";
  verified: boolean;
  rating?: number;
  amenities?: string[];
  thumbnail?: string;
  liveDate?: string;
}

export const PROPERTY_DATA: Property[] = [
  {
    id: "1",
    title: "M3M Golf Estate · Live Tour",
    developer: "M3M",
    location: "Sector 65, Gurgaon",
    sector: "Sector 65",
    city: "Gurgaon",
    lat: 28.4646,
    lng: 77.0266,
    type: "live",
    propertyType: "4BHK",
    price: 3.5,
    priceDisplay: "₹3.5 Cr onwards",
    size: "2800 sq.ft",
    viewers: 1284,
    status: "under-construction",
    verified: true,
    rating: 4.8,
    amenities: ["Golf Course", "Club House", "Swimming Pool"],
  },
  {
    id: "2",
    title: "DLF Privana South",
    developer: "DLF",
    location: "Sector 76, Gurgaon",
    sector: "Sector 76",
    city: "Gurgaon",
    lat: 28.4321,
    lng: 77.0667,
    type: "live",
    propertyType: "3BHK",
    price: 1.8,
    priceDisplay: "₹1.8 Cr onwards",
    size: "1950 sq.ft",
    viewers: 812,
    status: "ready-to-move",
    verified: true,
    rating: 4.6,
    amenities: ["Park", "Gym", "24x7 Security"],
  },
  {
    id: "3",
    title: "Sector 84 Masterclass",
    developer: "Locality Legends",
    location: "Sector 84, Gurgaon",
    sector: "Sector 84",
    city: "Gurgaon",
    lat: 28.4089,
    lng: 77.051,
    type: "upcoming",
    propertyType: "3BHK",
    price: 2.2,
    priceDisplay: "₹2.2 Cr onwards",
    status: "under-construction",
    verified: true,
    liveDate: "Sat 7 PM · 2.4k registered",
  },
  {
    id: "4",
    title: "Smart Buyer Workshop",
    developer: "Locality Legends",
    location: "Gurgaon",
    sector: "Golf Course Road",
    city: "Gurgaon",
    lat: 28.49,
    lng: 77.085,
    type: "upcoming",
    propertyType: "Villa",
    price: 5.0,
    priceDisplay: "₹5 Cr onwards",
    status: "under-construction",
    verified: true,
    liveDate: "Sun 6 PM",
  },
  {
    id: "5",
    title: "Emaar Digi Homes",
    developer: "Emaar",
    location: "Sector 62, Gurgaon",
    sector: "Sector 62",
    city: "Gurgaon",
    lat: 28.45,
    lng: 77.09,
    type: "property",
    propertyType: "3BHK",
    price: 2.4,
    priceDisplay: "₹2.4 Cr onwards",
    size: "2100 sq.ft",
    status: "ready-to-move",
    verified: false,
    rating: 4.3,
    amenities: ["Smart Home", "Clubhouse"],
  },
  {
    id: "6",
    title: "Sobha City",
    developer: "Sobha",
    location: "Sector 108, Gurgaon",
    sector: "Sector 108",
    city: "Gurgaon",
    lat: 28.475,
    lng: 77.04,
    type: "property",
    propertyType: "4BHK",
    price: 3.1,
    priceDisplay: "₹3.1 Cr onwards",
    size: "3200 sq.ft",
    status: "ready-to-move",
    verified: true,
    rating: 4.7,
    amenities: ["Pool", "Tennis Court", "Spa"],
  },
  {
    id: "7",
    title: "Adani Samsara",
    developer: "Adani",
    location: "Sector 63, Gurgaon",
    sector: "Sector 63",
    city: "Gurgaon",
    lat: 28.42,
    lng: 77.03,
    type: "property",
    propertyType: "Villa",
    price: 5.8,
    priceDisplay: "₹5.8 Cr onwards",
    size: "5000 sq.ft",
    status: "under-construction",
    verified: true,
    rating: 4.9,
    amenities: ["Private Pool", "Garden", "Home Theatre"],
  },
  {
    id: "8",
    title: "Tata Primanti — Open House",
    developer: "Tata",
    location: "Sector 72, Gurgaon",
    sector: "Sector 72",
    city: "Gurgaon",
    lat: 28.44,
    lng: 77.075,
    type: "live",
    propertyType: "3BHK",
    price: 1.9,
    priceDisplay: "₹1.9 Cr onwards",
    size: "1850 sq.ft",
    viewers: 521,
    status: "ready-to-move",
    verified: true,
    rating: 4.5,
    amenities: ["Park", "Gym", "Kids Play Area"],
  },
  {
    id: "9",
    title: "Godrej Summit",
    developer: "Godrej",
    location: "Sector 104, Gurgaon",
    sector: "Sector 104",
    city: "Gurgaon",
    lat: 28.4156,
    lng: 77.0628,
    type: "property",
    propertyType: "3BHK",
    price: 1.6,
    priceDisplay: "₹1.6 Cr onwards",
    size: "1750 sq.ft",
    status: "ready-to-move",
    verified: true,
    rating: 4.4,
    amenities: ["Gym", "Park", "Security"],
  },
  {
    id: "10",
    title: "Mahindra Luminare",
    developer: "Mahindra",
    location: "Sector 59, Gurgaon",
    sector: "Sector 59",
    city: "Gurgaon",
    lat: 28.4234,
    lng: 77.0889,
    type: "property",
    propertyType: "2BHK",
    price: 1.2,
    priceDisplay: "₹1.2 Cr onwards",
    size: "1350 sq.ft",
    status: "ready-to-move",
    verified: false,
    rating: 4.2,
    amenities: ["Pool", "Gym"],
  },
  {
    id: "11",
    title: "Vatika The Seven Lamps",
    developer: "Vatika",
    location: "Sector 82, Gurgaon",
    sector: "Sector 82",
    city: "Gurgaon",
    lat: 28.4411,
    lng: 77.0544,
    type: "property",
    propertyType: "4BHK",
    price: 2.8,
    priceDisplay: "₹2.8 Cr onwards",
    size: "2950 sq.ft",
    status: "ready-to-move",
    verified: true,
    rating: 4.6,
    amenities: ["Landscaped Gardens", "Clubhouse", "Pool"],
  },
  {
    id: "12",
    title: "Bestech Park View City",
    developer: "Bestech",
    location: "Sector 49, Gurgaon",
    sector: "Sector 49",
    city: "Gurgaon",
    lat: 28.4123,
    lng: 77.0321,
    type: "property",
    propertyType: "Plot",
    price: 4.5,
    priceDisplay: "₹4.5 Cr onwards",
    size: "300 sq.yd",
    status: "ready-to-move",
    verified: true,
    rating: 4.3,
  },
];

export const FILTER_OPTIONS = [
  { id: "live", label: "Live Now", type: "status" },
  { id: "upcoming", label: "Upcoming", type: "status" },
  { id: "property", label: "Properties", type: "status" },
  { id: "2BHK", label: "2 BHK", type: "propertyType" },
  { id: "3BHK", label: "3 BHK", type: "propertyType" },
  { id: "4BHK", label: "4 BHK", type: "propertyType" },
  { id: "Villa", label: "Villa", type: "propertyType" },
  { id: "Plot", label: "Plot", type: "propertyType" },
  { id: "under-2cr", label: "Under ₹2 Cr", type: "price" },
  { id: "2cr-4cr", label: "₹2-4 Cr", type: "price" },
  { id: "above-4cr", label: "Above ₹4 Cr", type: "price" },
  { id: "verified", label: "Verified Only", type: "verified" },
] as const;

export type FilterOption = (typeof FILTER_OPTIONS)[number];

export function filterProperties(
  properties: Property[],
  activeFilters: string[],
  searchQuery: string = "",
): Property[] {
  let filtered = [...properties];

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.sector.toLowerCase().includes(query) ||
        p.developer.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query),
    );
  }

  // Active filters
  if (activeFilters.length > 0) {
    filtered = filtered.filter((property) => {
      return activeFilters.every((filterId) => {
        const filter = FILTER_OPTIONS.find((f) => f.id === filterId);
        if (!filter) return true;

        switch (filter.type) {
          case "status":
            return property.type === filterId;
          case "propertyType":
            return property.propertyType === filterId;
          case "price":
            if (filterId === "under-2cr") return property.price < 2;
            if (filterId === "2cr-4cr") return property.price >= 2 && property.price <= 4;
            if (filterId === "above-4cr") return property.price > 4;
            return true;
          case "verified":
            return property.verified;
          default:
            return true;
        }
      });
    });
  }

  return filtered;
}
