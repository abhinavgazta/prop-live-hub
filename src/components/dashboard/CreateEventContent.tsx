import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sparkles,
  Calendar,
  MapPin,
  Building2,
  Radio,
  Users,
  Image as ImageIcon,
  Info,
  Clock,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  eventType: z.enum(["live-tour", "masterclass", "open-house", "q-and-a", "launch-event"]),
  propertyName: z.string().min(2, "Property name is required"),
  developer: z.string().min(2, "Developer name is required"),
  sector: z.string().min(1, "Sector is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500),
  propertyType: z.enum(["3bhk", "4bhk", "villa", "plot", "penthouse", "studio"]),
  priceRange: z.string().min(1, "Price range is required"),
  amenities: z.string(),
  maxAttendees: z.string().min(1, "Max attendees is required"),
  thumbnailUrl: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const EVENT_TYPES = [
  { value: "live-tour", label: "Live Property Tour", icon: Radio, color: "live" },
  { value: "masterclass", label: "Masterclass", icon: Sparkles, color: "teal" },
  { value: "open-house", label: "Open House", icon: Building2, color: "primary" },
  { value: "q-and-a", label: "Q&A Session", icon: Users, color: "gold" },
  { value: "launch-event", label: "Launch Event", icon: Sparkles, color: "primary" },
];

const PROPERTY_TYPES = [
  { value: "3bhk", label: "3 BHK" },
  { value: "4bhk", label: "4 BHK" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "penthouse", label: "Penthouse" },
  { value: "studio", label: "Studio" },
];

const SECTORS = [
  "Sector 65",
  "Sector 76",
  "Sector 84",
  "Sector 72",
  "Golf Course Road",
  "Sohna Road",
  "MG Road",
  "DLF Phase 1",
  "DLF Phase 2",
  "DLF Phase 3",
];

export function CreateEventContent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventType: "live-tour",
      propertyType: "3bhk",
      duration: "60",
      maxAttendees: "500",
    },
  });

  const selectedEventType = watch("eventType");
  const selectedPropertyType = watch("propertyType");
  const selectedSector = watch("sector");

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);

    try {
      // Create event object
      const eventData = {
        ...data,
        createdBy: "demo-user@proplive.com",
      };

      // Save both to server and localStorage for redundancy
      const event = {
        _id: Date.now().toString(),
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "scheduled" as const,
        registeredCount: 0,
      };

      // Save to localStorage
      const stored = localStorage.getItem("proplive_events");
      const events = stored ? JSON.parse(stored) : [];
      events.unshift(event);
      localStorage.setItem("proplive_events", JSON.stringify(events));

      console.log("Event saved:", event);

      toast.success("Event created successfully!", {
        description: `Your ${EVENT_TYPES.find((t) => t.value === data.eventType)?.label} is scheduled for ${data.date}`,
      });

      // Navigate to my events page
      setTimeout(() => {
        navigate({ to: "/seller/my-events" });
      }, 1000);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Host Your Event
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Create Virtual Property Event
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Launch your property with live tours, masterclasses, and Q&A sessions. Reach thousands of
          verified buyers in Gurgaon's most engaged real estate community.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Main Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 shadow-[var(--shadow-soft)]">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Info className="h-5 w-5 text-primary" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g., M3M Golf Estate — Exclusive Live Tour"
                  className="mt-1.5"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="eventType">Event Type *</Label>
                <Select
                  value={selectedEventType}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onValueChange={(value) => setValue("eventType", value as any)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.eventType && (
                  <p className="mt-1 text-xs text-destructive">{errors.eventType.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    className="mt-1.5"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.date && (
                    <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="time">Start Time *</Label>
                  <Input id="time" type="time" {...register("time")} className="mt-1.5" />
                  {errors.time && (
                    <p className="mt-1 text-xs text-destructive">{errors.time.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Select
                    value={watch("duration")}
                    onValueChange={(value) => setValue("duration", value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.duration && (
                    <p className="mt-1 text-xs text-destructive">{errors.duration.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees *</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    {...register("maxAttendees")}
                    placeholder="500"
                    className="mt-1.5"
                  />
                  {errors.maxAttendees && (
                    <p className="mt-1 text-xs text-destructive">{errors.maxAttendees.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Event Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe what attendees can expect, key highlights, what will be covered..."
                  className="mt-1.5 min-h-[100px]"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {watch("description")?.length || 0}/500 characters
                </p>
              </div>
            </div>
          </Card>

          {/* Property Details */}
          <Card className="p-6 shadow-[var(--shadow-soft)]">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Building2 className="h-5 w-5 text-primary" />
              Property Details
            </h2>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="propertyName">Property Name *</Label>
                  <Input
                    id="propertyName"
                    {...register("propertyName")}
                    placeholder="e.g., M3M Golf Estate"
                    className="mt-1.5"
                  />
                  {errors.propertyName && (
                    <p className="mt-1 text-xs text-destructive">{errors.propertyName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="developer">Developer *</Label>
                  <Input
                    id="developer"
                    {...register("developer")}
                    placeholder="e.g., M3M Group"
                    className="mt-1.5"
                  />
                  {errors.developer && (
                    <p className="mt-1 text-xs text-destructive">{errors.developer.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="sector">Location / Sector *</Label>
                  <Select
                    value={selectedSector}
                    onValueChange={(value) => setValue("sector", value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sector && (
                    <p className="mt-1 text-xs text-destructive">{errors.sector.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={selectedPropertyType}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onValueChange={(value) => setValue("propertyType", value as any)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.propertyType && (
                    <p className="mt-1 text-xs text-destructive">{errors.propertyType.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="priceRange">Price Range *</Label>
                <Input
                  id="priceRange"
                  {...register("priceRange")}
                  placeholder="e.g., ₹2.4 Cr - ₹3.1 Cr"
                  className="mt-1.5"
                />
                {errors.priceRange && (
                  <p className="mt-1 text-xs text-destructive">{errors.priceRange.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="amenities">Key Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  {...register("amenities")}
                  placeholder="e.g., Clubhouse, Pool, Gym, Kids Play Area"
                  className="mt-1.5"
                />
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="gap-2"
              style={{ background: "var(--gradient-primary)" }}
            >
              {isSubmitting ? (
                <>Creating Event...</>
              ) : (
                <>
                  <Radio className="h-4 w-4" />
                  Create Event
                </>
              )}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: "/seller" })}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Preview Sidebar */}
        <aside className="space-y-4">
          <Card className="sticky top-4 p-5 shadow-[var(--shadow-soft)]">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Event Preview
            </h3>

            <div
              className="relative mb-4 aspect-video overflow-hidden rounded-xl"
              style={{ background: "var(--gradient-primary)" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
              <div className="absolute inset-0 grid place-items-center">
                <ImageIcon className="h-12 w-12 text-white/40" />
              </div>
              {selectedEventType && (
                <Badge className="absolute left-2 top-2 gap-1 bg-live px-2 py-0.5 text-[10px]">
                  <span className="h-1 w-1 rounded-full bg-white" />
                  {EVENT_TYPES.find((t) => t.value === selectedEventType)?.label.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-bold">{watch("title") || "Your Event Title"}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {watch("propertyName") || "Property Name"} · {watch("sector") || "Location"}
                </div>
              </div>

              {watch("date") && watch("time") && (
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div className="text-xs">
                    <div className="font-semibold">
                      {new Date(watch("date")).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-muted-foreground">
                      {watch("time")} · {watch("duration")} min
                    </div>
                  </div>
                </div>
              )}

              {watch("priceRange") && (
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <div className="text-xs">
                    <div className="text-muted-foreground">Starting from</div>
                    <div className="font-semibold">{watch("priceRange")}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                <Users className="h-4 w-4 text-primary" />
                <div className="text-xs">
                  <div className="text-muted-foreground">Max Attendees</div>
                  <div className="font-semibold">{watch("maxAttendees") || "500"}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-background p-3">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Your Karma Score
              </div>
              <div className="text-2xl font-bold text-primary">1,284</div>
              <div className="mt-1 text-xs text-muted-foreground">
                High-karma hosts get 3x more registrations
              </div>
            </div>
          </Card>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
              <Info className="h-4 w-4" />
              Pro Tips
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Schedule events 3-5 days in advance for best turnout</li>
              <li>• Evening slots (6-8 PM) get 2x more engagement</li>
              <li>• Include verified insights to boost credibility</li>
              <li>• Invite locality legends to co-host for wider reach</li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}
