// File-based persistent storage for events
// Data persists across server restarts

import type { Event, CreateEventInput } from "@/lib/models/event";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "events.json");

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load events from file
function loadEventsFromFile(): Map<string, Event> {
  ensureDataDir();

  if (!fs.existsSync(DATA_FILE)) {
    return new Map();
  }

  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const events: Event[] = JSON.parse(data);
    const map = new Map<string, Event>();

    // Convert date strings back to Date objects
    events.forEach((event) => {
      map.set(event._id!, {
        ...event,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      });
    });

    return map;
  } catch (error) {
    console.error("Error loading events from file:", error);
    return new Map();
  }
}

// Save events to file
function saveEventsToFile(eventsMap: Map<string, Event>) {
  ensureDataDir();

  try {
    const events = Array.from(eventsMap.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving events to file:", error);
  }
}

// In-memory storage (loaded from file on startup)
const eventsStore = loadEventsFromFile();
let idCounter = eventsStore.size + 1;

export function createEvent(data: CreateEventInput): Event {
  const id = `event_${Date.now()}_${idCounter++}`;

  const event: Event = {
    _id: id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "scheduled",
    registeredCount: 0,
  };

  eventsStore.set(id, event);
  saveEventsToFile(eventsStore);

  return event;
}

export function getAllEvents(): Event[] {
  return Array.from(eventsStore.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export function getEventById(id: string): Event | undefined {
  return eventsStore.get(id);
}

export function updateEvent(id: string, data: Partial<Event>): Event | null {
  const event = eventsStore.get(id);
  if (!event) return null;

  const updated = {
    ...event,
    ...data,
    updatedAt: new Date(),
  };

  eventsStore.set(id, updated);
  saveEventsToFile(eventsStore);

  return updated;
}

export function deleteEvent(id: string): boolean {
  const deleted = eventsStore.delete(id);
  if (deleted) {
    saveEventsToFile(eventsStore);
  }
  return deleted;
}

export function getEventsByStatus(status: Event["status"]): Event[] {
  return Array.from(eventsStore.values())
    .filter((e) => e.status === status)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
