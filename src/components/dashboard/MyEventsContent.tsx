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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

const EVENT_TYPE_LABELS: Record<string, string> = {
  "live-tour": "Live Tour",
  "masterclass": "Masterclass",
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

interface LocalEvent {
  _id?: string;
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
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  registeredCount: number;
  viewersPeak?: number;
  replayViews?: number;
}

export function MyEventsContent() {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<LocalEvent | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Load from localStorage (will be replaced with server-side call)
      const stored = localStorage.getItem("proplive_events");
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event: LocalEvent) => {
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
        const filtered = events.filter((e: LocalEvent) => e._id !== eventToDelete._id);
        localStorage.setItem("proplive_events", JSON.stringify(filtered));
        setEvents(filtered);
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
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My Hosted Events</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage all your property tours, masterclasses, and launch events
          </p>
        </div>
        <Link to="/seller/create-event">
          <Button size="lg" className="gap-2" style={{ background: "var(--gradient-primary)" }}>
            <Plus className="h-4 w-4" />
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Events",
            value: events.length,
            icon: Calendar,
            color: "text-primary",
          },
          {
            label: "Scheduled",
            value: events.filter((e) => e.status === "scheduled").length,
            icon: Calendar,
            color: "text-teal",
          },
          {
            label: "Live Now",
            value: events.filter((e) => e.status === "live").length,
            icon: Radio,
            color: "text-live",
          },
          {
            label: "Completed",
            value: events.filter((e) => e.status === "completed").length,
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

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No events yet</h3>
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
          {events.map((event) => {
            const StatusIcon = STATUS_ICONS[event.status];
            return (
              <Card key={event._id} className="overflow-hidden">
                <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  {/* Event Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold">{event.title}</h3>
                      <Badge className={STATUS_COLORS[event.status]}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                      </Badge>
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
                          <span className="font-medium">{event.registeredCount}</span> /{" "}
                          {event.maxAttendees} registered
                        </span>
                      </div>

                      {event.viewersPeak && (
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Peak: <span className="font-medium">{event.viewersPeak}</span> viewers
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">{event.propertyName}</span>
                      <span>·</span>
                      <span>{event.developer}</span>
                      <span>·</span>
                      <span>{event.sector}</span>
                      <span>·</span>
                      <span>{event.priceRange}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {event.status === "scheduled" && (
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    )}
                    {event.status === "live" && (
                      <Link to="/seller/host">
                        <Button size="sm" className="gap-1.5 bg-live hover:bg-live/90">
                          <Radio className="h-3.5 w-3.5" />
                          Go Live
                        </Button>
                      </Link>
                    )}
                    {event.status === "completed" && (
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <PlayCircle className="h-3.5 w-3.5" />
                        View Replay
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={() => handleDeleteClick(event)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be
              undone and will remove all associated data.
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
