export interface Event {
  _id?: string;
  title: string;
  eventType: "live-tour" | "masterclass" | "open-house" | "q-and-a" | "launch-event";
  propertyName: string;
  developer: string;
  sector: string;
  date: string;
  time: string;
  duration: string;
  description: string;
  propertyType: "3bhk" | "4bhk" | "villa" | "plot" | "penthouse" | "studio";
  priceRange: string;
  amenities: string;
  maxAttendees: string;
  thumbnailUrl?: string;

  // Metadata
  createdBy: string; // User ID or email
  createdAt: Date;
  updatedAt: Date;
  status: "scheduled" | "live" | "completed" | "cancelled";

  // Stats
  registeredCount: number;
  viewersPeak?: number;
  replayViews?: number;
}

export type CreateEventInput = Omit<
  Event,
  "_id" | "createdAt" | "updatedAt" | "status" | "registeredCount"
>;
