// Geocoding utilities using Nominatim (OpenStreetMap)
// Free geocoding service - no API key required

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    suburb?: string;
    state?: string;
    country?: string;
  };
  type: string;
}

export async function searchLocality(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: query,
          format: "json",
          addressdetails: "1",
          limit: "10",
          countrycodes: "in", // Focus on India
        }),
      {
        headers: {
          "User-Agent": "prop-live-hub",
        },
      },
    );

    if (!response.ok) throw new Error("Geocoding failed");

    const results: GeocodingResult[] = await response.json();
    return results.filter(
      (r) =>
        r.type === "suburb" ||
        r.type === "neighbourhood" ||
        r.type === "city" ||
        r.type === "town" ||
        r.address.suburb ||
        r.address.city ||
        r.address.town,
    );
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
}

export function formatLocationName(result: GeocodingResult): string {
  const { address } = result;
  const parts: string[] = [];

  if (address.suburb) parts.push(address.suburb);
  if (address.city || address.town) parts.push(address.city || address.town || "");
  if (address.state && parts.length < 2) parts.push(address.state);

  return parts.filter(Boolean).join(", ") || result.display_name;
}
