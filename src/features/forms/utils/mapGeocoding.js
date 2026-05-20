const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'ClearformFormBuilder/1.0';

const fetchJson = async (url) => {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error('Geocoding request failed');
  return res.json();
};

/** Search addresses / place names (forward geocoding). */
export async function searchLocations(query, { limit = 5 } = {}) {
  const q = query?.trim();
  if (!q || q.length < 2) return [];
  const params = new URLSearchParams({
    q,
    format: 'json',
    addressdetails: '1',
    limit: String(limit),
  });
  const data = await fetchJson(`${NOMINATIM_BASE}/search?${params}`);
  return (data || []).map((item) => ({
    lat: Number(item.lat),
    lng: Number(item.lon),
    address: item.display_name,
    placeId: item.place_id,
  }));
}

/** Resolve coordinates to a human-readable address. */
export async function reverseGeocode(lat, lng) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    addressdetails: '1',
  });
  const data = await fetchJson(`${NOMINATIM_BASE}/reverse?${params}`);
  return data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export const DEFAULT_MAP_CENTER = { lat: 51.5074, lng: -0.1278, address: 'London, UK' };
