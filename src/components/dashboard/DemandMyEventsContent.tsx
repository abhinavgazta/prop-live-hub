import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Radio,
  Building2,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  getMyRegisteredEvents,
  type StoredEvent,
  getEventRegistrationCount,
} from "@/lib/property-data";

const EVENT_TYPE_LABELS: Record<string, string> = {
  "live-tour": "Live Tour",
  masterclass: "Masterclass",
  "open-house": "Open House",
  "q-and-a": "Q&A Session",
  "launch-event": "Launch Event",
};

// Helper function to determine effective status based on date
function getEffectiveStatus(event: StoredEvent): "scheduled" | "live" | "completed" | "cancelled" {
  // If already marked as completed or cancelled, keep that status
  if (event.status === "completed" || event.status === "cancelled") {
    return event.status;
  }

  const now = new Date();
  const eventDateTime = new Date(`${event.date}T${event.time}`);

  // If event date has passed, mark as completed
  if (eventDateTime < now) {
    return "completed";
  }

  // Check if live (within 2 hours of start time)
  const timeDiff = eventDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff <= 2 && hoursDiff >= 0) {
    return "live";
  }

  return "scheduled";
}

export function DemandMyEventsContent() {
  const [events, setEvents] = useState<StoredEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();

    // Listen for registration changes
    const handleUpdate = () => {
      loadEvents();
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("proplive_registration_changed", handleUpdate);
    window.addEventListener("proplive_event_created", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("proplive_registration_changed", handleUpdate);
      window.removeEventListener("proplive_event_created", handleUpdate);
    };
  }, []);

  const loadEvents = () => {
    try {
      setLoading(true);
      const registeredEvents = getMyRegisteredEvents();
      // Update registration counts and effective status
      const eventsWithCounts = registeredEvents.map((event) => ({
        ...event,
        status: getEffectiveStatus(event),
        registeredCount: getEventRegistrationCount(event._id),
      }));
      setEvents(eventsWithCounts);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Categorize events based on effective status
  const upcomingEvents = events.filter((e) => e.status === "scheduled" || e.status === "live");

  const pastEvents = events.filter((e) => e.status === "completed" || e.status === "cancelled");

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4 py-6 md:px-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-3 text-sm text-muted-foreground">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Your Registrations
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My Registered Events</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View all property tours and events you've registered for
          </p>
        </div>
        <Link to="/demand">
          <Button size="lg" className="gap-2" style={{ background: "var(--gradient-primary)" }}>
            <Filter className="h-4 w-4" />
            Discover Events
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Total Registered",
            value: events.length,
            icon: Calendar,
            color: "text-primary",
          },
          {
            label: "Upcoming",
            value: upcomingEvents.length,
            icon: Clock,
            color: "text-teal",
          },
          {
            label: "Attended/Past",
            value: pastEvents.length,
            icon: CheckCircle,
            color: "text-emerald-600",
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
                <div className="mt-1 text-2xl font-bold">{stat.value}</div>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Events List with Tabs */}
      {events.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No registered events yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse and register for property tours and events
          </p>
          <Link to="/demand">
            <Button className="mt-4 gap-2">
              <Filter className="h-4 w-4" />
              Discover Events
            </Button>
          </Link>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All ({events.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">No upcoming events</p>
              </Card>
            ) : (
              upcomingEvents.map((event) => <EventCard key={event._id} event={event} />)
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastEvents.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">No past events</p>
              </Card>
            ) : (
              pastEvents.map((event) => <EventCard key={event._id} event={event} />)
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function EventCard({ event }: { event: StoredEvent }) {
  const isLive = event.status === "live";
  const isUpcoming = event.status === "scheduled";
  const isPast = event.status === "completed" || event.status === "cancelled";

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        {/* Event Info */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold">{event.title}</h3>
            {isLive && (
              <Badge className="bg-live/15 text-live">
                <Radio className="mr-1 h-3 w-3" />
                Live Now
              </Badge>
            )}
            {isUpcoming && !isLive && (
              <Badge className="bg-teal/15 text-teal">
                <Clock className="mr-1 h-3 w-3" />
                Upcoming
              </Badge>
            )}
            {isPast && (
              <Badge className="bg-muted text-muted-foreground">
                <CheckCircle className="mr-1 h-3 w-3" />
                {event.status === "completed" ? "Completed" : "Cancelled"}
              </Badge>
            )}
            <Badge variant="outline">{EVENT_TYPE_LABELS[event.eventType] || event.eventType}</Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-muted-foreground">at {event.time}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                <span className="font-medium">{event.registeredCount}</span> / {event.maxAttendees}{" "}
                registered
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{event.sector}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{event.propertyName}</span>
            <span>·</span>
            <span>{event.developer}</span>
            <span>·</span>
            <span>{event.priceRange}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isLive && (
            <Link to="/demand/live">
              <Button size="sm" className="gap-1.5 bg-live hover:bg-live/90">
                <Radio className="h-3.5 w-3.5" />
                Join Now
              </Button>
            </Link>
          )}
          {!isLive && event.status === "completed" && (
            <Link to="/demand/replay">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Watch Replay
              </Button>
            </Link>
          )}
          {isUpcoming && !isLive && (
            <Badge variant="secondary" className="h-8 px-3">
              <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
              Registered
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
