import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  Radio,
  PlayCircle,
  CheckCircle,
  XCircle,
  Plus,
  MapPin,
  Clock,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  getMyHostedEvents,
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

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-teal/15 text-teal",
  live: "bg-live/15 text-live",
  completed: "bg-emerald-500/15 text-emerald-600",
  cancelled: "bg-destructive/15 text-destructive",
};

const STATUS_ICONS: Record<string, any> = {
  scheduled: Calendar,
  live: Radio,
  completed: CheckCircle,
  cancelled: XCircle,
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

export function MyEventsContent() {
  const [hostedEvents, setHostedEvents] = useState<StoredEvent[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<StoredEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<StoredEvent | null>(null);

  useEffect(() => {
    loadEvents();

    // Listen for updates
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

      // Load hosted events
      const hosted = getMyHostedEvents();
      const hostedWithCounts = hosted.map((event) => ({
        ...event,
        status: getEffectiveStatus(event),
        registeredCount: getEventRegistrationCount(event._id),
      }));
      setHostedEvents(hostedWithCounts);

      // Load registered events
      const registered = getMyRegisteredEvents();
      const registeredWithCounts = registered.map((event) => ({
        ...event,
        status: getEffectiveStatus(event),
        registeredCount: getEventRegistrationCount(event._id),
      }));
      setRegisteredEvents(registeredWithCounts);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event: StoredEvent) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!eventToDelete) return;

    try {
      // Remove from localStorage
      const stored = localStorage.getItem("proplive_events");
      if (stored) {
        const events = JSON.parse(stored);
        const filtered = events.filter((e: StoredEvent) => e._id !== eventToDelete._id);
        localStorage.setItem("proplive_events", JSON.stringify(filtered));
        loadEvents();
        window.dispatchEvent(new Event("proplive_event_created"));
      }

      toast.success("Event deleted successfully", {
        description: `"${eventToDelete.title}" has been removed`,
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event", {
        description: "Please try again later",
      });
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

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
              Your Events
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My Events</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage hosted events and view registered events
          </p>
        </div>
        <Link to="/seller/create-event">
          <Button size="lg" className="gap-2" style={{ background: "var(--gradient-primary)" }}>
            <Plus className="h-4 w-4" />
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="hosted" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="hosted">Hosted ({hostedEvents.length})</TabsTrigger>
          <TabsTrigger value="registered">Registered ({registeredEvents.length})</TabsTrigger>
        </TabsList>

        {/* Hosted Events Tab */}
        <TabsContent value="hosted" className="space-y-4">
          {/* Stats for Hosted */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                label: "Total Hosted",
                value: hostedEvents.length,
                icon: Calendar,
                color: "text-primary",
              },
              {
                label: "Scheduled",
                value: hostedEvents.filter((e) => e.status === "scheduled").length,
                icon: Clock,
                color: "text-teal",
              },
              {
                label: "Live Now",
                value: hostedEvents.filter((e) => e.status === "live").length,
                icon: Radio,
                color: "text-live",
              },
              {
                label: "Completed",
                value: hostedEvents.filter((e) => e.status === "completed").length,
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

          {/* Hosted Events List */}
          {hostedEvents.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No hosted events yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first event to start engaging with buyers
              </p>
              <Link to="/seller/create-event">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Event
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {hostedEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isHosted={true}
                  onDelete={() => handleDeleteClick(event)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Registered Events Tab */}
        <TabsContent value="registered" className="space-y-4">
          {/* Stats for Registered */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Total Registered",
                value: registeredEvents.length,
                icon: Calendar,
                color: "text-primary",
              },
              {
                label: "Upcoming",
                value: registeredEvents.filter(
                  (e) => e.status === "scheduled" || e.status === "live",
                ).length,
                icon: Clock,
                color: "text-teal",
              },
              {
                label: "Attended/Past",
                value: registeredEvents.filter(
                  (e) => e.status === "completed" || e.status === "cancelled",
                ).length,
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

          {/* Registered Events List */}
          {registeredEvents.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No registered events yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse and register for property tours and events
              </p>
              <Link to="/seller">
                <Button className="mt-4 gap-2">
                  <MapPin className="h-4 w-4" />
                  Discover Events
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {registeredEvents.map((event) => (
                <EventCard key={event._id} event={event} isHosted={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone
              and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// EventCard Component
function EventCard({
  event,
  isHosted,
  onDelete,
}: {
  event: StoredEvent;
  isHosted: boolean;
  onDelete?: () => void;
}) {
  const StatusIcon = STATUS_ICONS[event.status];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        {/* Event Info */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold">{event.title}</h3>
            <Badge className={STATUS_COLORS[event.status]}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
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
              <span>{event.sector}</span>
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
          {event.status === "scheduled" && isHosted && (
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
          {event.status === "live" && (
            <Link to="/seller/live">
              <Button size="sm" className="gap-1.5 bg-live hover:bg-live/90">
                <Radio className="h-3.5 w-3.5" />
                {isHosted ? "Go Live" : "Join"}
              </Button>
            </Link>
          )}
          {event.status === "completed" && (
            <Link to="/seller/replay">
              <Button variant="outline" size="sm" className="gap-1.5">
                <PlayCircle className="h-3.5 w-3.5" />
                View Replay
              </Button>
            </Link>
          )}
          {event.status === "scheduled" && !isHosted && (
            <Button variant="outline" size="sm" className="gap-1.5 cursor-default">
              <CheckCircle className="h-3.5 w-3.5" />
              Registered
            </Button>
          )}
          {isHosted && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
