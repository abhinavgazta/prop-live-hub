import { json } from "@tanstack/react-start";
import type { CreateEventInput, Event } from "@/lib/models/event";
import * as memoryStore from "@/lib/db/memoryStore";

// Server function that uses in-memory database
export async function createEventInDB(data: CreateEventInput) {
  try {
    // Validate required fields
    if (!data.title || !data.eventType || !data.propertyName) {
      throw new Error("Missing required fields");
    }

    const event = memoryStore.createEvent(data);

    return {
      success: true,
      eventId: event._id,
      event,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create event");
  }
}

export async function getEventsFromDB() {
  try {
    const events = memoryStore.getAllEvents();

    return {
      success: true,
      events: events.map((event) => ({
        ...event,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch events");
  }
}
