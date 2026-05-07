// Property data module - all dynamic from localStorage

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
  registeredCount?: number;
  maxAttendees?: number;
}

export interface EventRegistration {
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: string;
}

export interface StoredEvent {
  _id: string;
  title: string;
  eventType: string;
  propertyName: string;
  developer: string;
  sector: string;
  date: string;
  time: string;
  duration: string;
  description: string;
  propertyType: string;
  priceRange: string;
  amenities: string;
  maxAttendees: string;
  thumbnailUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  registeredCount: number;
}

// Sector coordinates cache
const SECTOR_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Sector 65": { lat: 28.4646, lng: 77.0266 },
  "Sector 76": { lat: 28.4321, lng: 77.0667 },
  "Sector 84": { lat: 28.4089, lng: 77.051 },
  "Sector 72": { lat: 28.44, lng: 77.075 },
  "Golf Course Road": { lat: 28.49, lng: 77.085 },
  "Sohna Road": { lat: 28.412, lng: 77.031 },
  "MG Road": { lat: 28.4795, lng: 77.0266 },
  "DLF Phase 1": { lat: 28.4726, lng: 77.0974 },
  "DLF Phase 2": { lat: 28.4849, lng: 77.0887 },
  "DLF Phase 3": { lat: 28.4938, lng: 77.0926 },
  "Sector 62": { lat: 28.45, lng: 77.09 },
  "Sector 108": { lat: 28.475, lng: 77.04 },
  "Sector 63": { lat: 28.42, lng: 77.03 },
  "Sector 104": { lat: 28.4156, lng: 77.0628 },
  "Sector 59": { lat: 28.4234, lng: 77.0889 },
  "Sector 82": { lat: 28.4411, lng: 77.0544 },
  "Sector 49": { lat: 28.4123, lng: 77.0321 },
};

// Geocode location async
async function geocodeLocation(sector: string): Promise<{ lat: number; lng: number }> {
  if (SECTOR_COORDINATES[sector]) {
    return SECTOR_COORDINATES[sector];
  }

  try {
    const query = `${sector}, Gurgaon, India`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: query,
          format: "json",
          limit: "1",
        }),
      {
        headers: {
          "User-Agent": "prop-live-hub",
        },
      },
    );

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }

  // Fallback to Gurgaon center
  return { lat: 28.4595, lng: 77.0266 };
}

// Determine event type based on date/time
function getEventType(dateStr: string, timeStr: string): "live" | "upcoming" {
  const now = new Date();
  const eventDateTime = new Date(`${dateStr}T${timeStr}`);

  // Check if event is within 2 hours (consider it live)
  const timeDiff = eventDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff <= 2 && hoursDiff >= -2) {
    if (typeof window !== "undefined") {
      try {
        const broadcasting = localStorage.getItem("proplive_host_broadcasting");
        if (broadcasting === "1") return "live";
      } catch {}
    }
  }

  return "upcoming";
}

// Get registration count for event
export function getEventRegistrationCount(eventId: string): number {
  if (typeof window === "undefined") return 0;

  try {
    const stored = localStorage.getItem("proplive_registrations");
    if (!stored) return 0;

    const registrations: EventRegistration[] = JSON.parse(stored);
    return registrations.filter((r) => r.eventId === eventId).length;
  } catch (error) {
    console.error("Error getting registration count:", error);
    return 0;
  }
}

// Convert event to property format
async function convertEventToProperty(event: StoredEvent): Promise<Property> {
  const coordinates = await geocodeLocation(event.sector);

  // Determine event type based on status and broadcast flag
  let eventType: Property["type"];
  if (event.status === "completed") {
    eventType = "property"; // Grey dots for completed/replay events
  } else {
    let liveEventId: string | null = null;
    if (typeof window !== "undefined") {
      try {
        liveEventId = localStorage.getItem("proplive_live_event_id");
      } catch {}
    }
    if (liveEventId) {
      eventType = "live";
    } else {
      eventType = getEventType(event.date, event.time);
    }
  }

  let propertyType: Property["propertyType"] = "3BHK";
  if (event.propertyType === "3bhk") propertyType = "3BHK";
  else if (event.propertyType === "4bhk") propertyType = "4BHK";
  else if (event.propertyType === "villa") propertyType = "Villa";
  else if (event.propertyType === "plot") propertyType = "Plot";
  else if (event.propertyType === "studio" || event.propertyType === "penthouse")
    propertyType = "2BHK";

  const priceMatch = event.priceRange.match(/(\d+\.?\d*)/);
  const price = priceMatch ? parseFloat(priceMatch[1]) : 2.0;

  const eventDate = new Date(`${event.date}T${event.time}`);
  const dateStr = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const registeredCount = getEventRegistrationCount(event._id);

  return {
    id: event._id,
    title: event.title,
    developer: event.developer,
    location: `${event.sector}, Gurgaon`,
    sector: event.sector,
    city: "Gurgaon",
    lat: coordinates.lat,
    lng: coordinates.lng,
    type: eventType,
    propertyType: propertyType,
    price: price,
    priceDisplay: event.priceRange,
    viewers: eventType === "live" ? Math.floor(Math.random() * 500) + 100 : undefined,
    status: "under-construction",
    verified: true,
    liveDate: eventType === "upcoming" ? `${dateStr} at ${timeStr}` : undefined,
    registeredCount: registeredCount,
    maxAttendees: parseInt(event.maxAttendees) || 500,
  };
}

// Load events from localStorage
export async function getEventsFromLocalStorage(): Promise<Property[]> {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("proplive_events");
    if (!stored) return [];

    const events: StoredEvent[] = JSON.parse(stored);
    // Include all events now (including completed for grey dots on map)
    const properties = await Promise.all(events.map(convertEventToProperty));

    return properties;
  } catch (error) {
    console.error("Error loading events from localStorage:", error);
    return [];
  }
}

// Get all properties (all dynamic now)
export async function getAllProperties(): Promise<Property[]> {
  return await getEventsFromLocalStorage();
}

// Register for event
export function registerForEvent(
  eventId: string,
  userId: string = "demo-user",
  userName: string = "Demo User",
  userEmail: string = "user@proplive.com",
): boolean {
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem("proplive_registrations");
    const registrations: EventRegistration[] = stored ? JSON.parse(stored) : [];

    const alreadyRegistered = registrations.some(
      (r) => r.eventId === eventId && r.userId === userId,
    );

    if (alreadyRegistered) {
      return false;
    }

    const registration: EventRegistration = {
      eventId,
      userId,
      userName,
      userEmail,
      registeredAt: new Date().toISOString(),
    };

    registrations.push(registration);
    localStorage.setItem("proplive_registrations", JSON.stringify(registrations));
    window.dispatchEvent(new Event("proplive_registration_changed"));

    return true;
  } catch (error) {
    console.error("Error registering for event:", error);
    return false;
  }
}

// Check if user is registered
export function isUserRegistered(eventId: string, userId: string = "demo-user"): boolean {
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem("proplive_registrations");
    if (!stored) return false;

    const registrations: EventRegistration[] = JSON.parse(stored);
    return registrations.some((r) => r.eventId === eventId && r.userId === userId);
  } catch (error) {
    console.error("Error checking registration:", error);
    return false;
  }
}

// Get registered event IDs
export function getRegisteredEvents(userId: string = "demo-user"): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("proplive_registrations");
    if (!stored) return [];

    const registrations: EventRegistration[] = JSON.parse(stored);
    return registrations.filter((r) => r.userId === userId).map((r) => r.eventId);
  } catch (error) {
    console.error("Error getting registered events:", error);
    return [];
  }
}

// Get my registered events
export function getMyRegisteredEvents(userId: string = "demo-user"): StoredEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const registeredIds = getRegisteredEvents(userId);
    const stored = localStorage.getItem("proplive_events");
    if (!stored) return [];

    const events: StoredEvent[] = JSON.parse(stored);
    return events.filter((e) => registeredIds.includes(e._id));
  } catch (error) {
    console.error("Error getting my registered events:", error);
    return [];
  }
}

// Get my hosted events
export function getMyHostedEvents(userEmail: string = "demo-user@proplive.com"): StoredEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("proplive_events");
    if (!stored) return [];

    const events: StoredEvent[] = JSON.parse(stored);
    return events.filter((e) => e.createdBy === userEmail);
  } catch (error) {
    console.error("Error getting hosted events:", error);
    return [];
  }
}

// Filter options
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

// Filter properties
export function filterProperties(
  properties: Property[],
  activeFilters: string[],
  searchQuery: string = "",
): Property[] {
  let filtered = [...properties];

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
