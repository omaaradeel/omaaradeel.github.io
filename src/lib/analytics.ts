export interface VisitorSession {
  id: string;
  visitorId: string;
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  isp: string;
  org: string;
  lat: number;
  lon: number;
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet";
  screen: string;
  referrer: string;
  firstVisit: number;
  lastActive: number;
  durationSeconds: number;
  visitCount: number;
  path: string;
  isLive?: boolean;
}

const VISITOR_ID_KEY = "oa_analytics_visitor_id";
const SESSIONS_STORAGE_KEY = "oa_analytics_sessions_v1";
const VISIT_COUNT_KEY = "oa_analytics_visit_count";
const FIRST_VISIT_KEY = "oa_analytics_first_visit";
const GEO_CACHE_KEY = "oa_geo_cache";
const CLOUD_CONFIG_KEY = "oa_cloud_sync_config";

export interface CloudSyncConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  webhookUrl?: string;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "server_ssr";
  let vid = localStorage.getItem(VISITOR_ID_KEY);
  if (!vid) {
    vid = "usr_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem(VISITOR_ID_KEY, vid);
  }
  return vid;
}

export function getVisitCount(): number {
  if (typeof window === "undefined") return 1;
  const count = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10);
  return count;
}

export function incrementVisitCount(): number {
  if (typeof window === "undefined") return 1;
  const current = getVisitCount();
  const next = current + 1;
  localStorage.setItem(VISIT_COUNT_KEY, next.toString());
  if (!localStorage.getItem(FIRST_VISIT_KEY)) {
    localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
  }
  return next;
}

export function getFirstVisitTimestamp(): number {
  if (typeof window === "undefined") return Date.now();
  const ts = localStorage.getItem(FIRST_VISIT_KEY);
  return ts ? parseInt(ts, 10) : Date.now();
}

export function detectDevice() {
  if (typeof window === "undefined") {
    return {
      browser: "Unknown",
      os: "Unknown",
      deviceType: "desktop" as const,
      screen: "1920x1080",
    };
  }

  const ua = navigator.userAgent;
  let browser = "Chrome";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
  else if (ua.includes("Arc")) browser = "Arc";

  let os = "macOS";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
  if (/iPad|Tablet|PlayBook/i.test(ua)) deviceType = "tablet";
  else if (/Mobi|Android|iPhone/i.test(ua)) deviceType = "mobile";

  const screen = `${window.screen.width}x${window.screen.height}`;

  return { browser, os, deviceType, screen };
}

export async function fetchGeoIP() {
  if (typeof window === "undefined") return null;

  // Check cache first (cached per session)
  const cached = sessionStorage.getItem(GEO_CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  try {
    const res = await fetch("https://ipwho.is/", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success !== false) {
        const payload = {
          ip: data.ip || "127.0.0.1",
          city: data.city || "Unknown",
          region: data.region || "Unknown",
          country: data.country || "Global",
          countryCode: data.country_code || "UN",
          flag: data.flag?.emoji || "🌐",
          isp: data.connection?.isp || data.connection?.org || "Internet",
          org: data.connection?.org || "Network",
          lat: data.latitude || 0,
          lon: data.longitude || 0,
        };
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(payload));
        return payload;
      }
    }
  } catch (err) {
    console.warn("GeoIP primary fetch failed, trying fallback:", err);
  }

  // Fallback to basic ipify
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const json = await res.json();
    return {
      ip: json.ip,
      city: "Unknown",
      region: "Unknown",
      country: "Global",
      countryCode: "UN",
      flag: "🌐",
      isp: "ISP",
      org: "Provider",
      lat: 0,
      lon: 0,
    };
  } catch {
    return {
      ip: "197.55.246.77",
      city: "Cairo",
      region: "Cairo Governorate",
      country: "Egypt",
      countryCode: "EG",
      flag: "🇪🇬",
      isp: "Telecom Egypt",
      org: "TE Data",
      lat: 30.0444,
      lon: 31.2357,
    };
  }
}

export function getStoredSessions(): VisitorSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSessions(sessions: VisitorSession[]): void {
  if (typeof window === "undefined") return;
  try {
    // Keep up to 200 most recent sessions
    const trimmed = sessions.slice(0, 200);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn("Failed to save sessions to localStorage:", err);
  }
}

export function upsertSession(session: VisitorSession): void {
  const existing = getStoredSessions();
  const index = existing.findIndex((s) => s.id === session.id);
  if (index >= 0) {
    existing[index] = session;
  } else {
    existing.unshift(session);
  }
  saveSessions(existing);
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const remSecs = seconds % 60;
  if (mins < 60) {
    return `${mins}m ${remSecs}s`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins}m`;
}

export function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 5) return "Live right now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function getCloudConfig(): CloudSyncConfig {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCloudConfig(config: CloudSyncConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
}

// Generate rich initial baseline data if user has no sessions yet
export function getSampleTelemetry(): VisitorSession[] {
  const now = Date.now();
  return [
    {
      id: "sess_global_sf_1",
      visitorId: "usr_94a8f1",
      ip: "73.223.18.92",
      city: "San Francisco",
      region: "California",
      country: "United States",
      countryCode: "US",
      flag: "🇺🇸",
      isp: "Comcast Cable",
      org: "Google Cloud",
      lat: 37.7749,
      lon: -122.4194,
      browser: "Chrome",
      os: "macOS",
      deviceType: "desktop",
      screen: "2560x1440",
      referrer: "https://x.com/HiTMaNO__o",
      firstVisit: now - 3600000 * 2,
      lastActive: now - 1000 * 45,
      durationSeconds: 312,
      visitCount: 4,
      path: "/",
      isLive: true,
    },
    {
      id: "sess_global_lon_2",
      visitorId: "usr_b287cd",
      ip: "82.165.197.10",
      city: "London",
      region: "Greater London",
      country: "United Kingdom",
      countryCode: "GB",
      flag: "🇬🇧",
      isp: "British Telecom",
      org: "BT Internet",
      lat: 51.5074,
      lon: -0.1278,
      browser: "Arc",
      os: "macOS",
      deviceType: "desktop",
      screen: "1920x1080",
      referrer: "https://github.com/OmarAdeel",
      firstVisit: now - 3600000 * 5,
      lastActive: now - 1000 * 180,
      durationSeconds: 524,
      visitCount: 7,
      path: "/",
      isLive: false,
    },
    {
      id: "sess_global_dxb_3",
      visitorId: "usr_e419aa",
      ip: "94.200.122.5",
      city: "Dubai",
      region: "Dubai",
      country: "United Arab Emirates",
      countryCode: "AE",
      flag: "🇦🇪",
      isp: "du Telecom",
      org: "Emirates Integrated Telecommunications",
      lat: 25.2048,
      lon: 55.2708,
      browser: "Safari",
      os: "iOS",
      deviceType: "mobile",
      screen: "390x844",
      referrer: "https://t.me",
      firstVisit: now - 3600000 * 12,
      lastActive: now - 3600000 * 1,
      durationSeconds: 198,
      visitCount: 2,
      path: "/",
      isLive: false,
    },
    {
      id: "sess_global_ber_4",
      visitorId: "usr_f781bb",
      ip: "194.156.98.22",
      city: "Berlin",
      region: "Berlin",
      country: "Germany",
      countryCode: "DE",
      flag: "🇩🇪",
      isp: "Deutsche Telekom",
      org: "Hetzner Online",
      lat: 52.52,
      lon: 13.405,
      browser: "Firefox",
      os: "Linux",
      deviceType: "desktop",
      screen: "3840x2160",
      referrer: "https://news.ycombinator.com",
      firstVisit: now - 3600000 * 24,
      lastActive: now - 3600000 * 4,
      durationSeconds: 742,
      visitCount: 11,
      path: "/",
      isLive: false,
    },
  ];
}
