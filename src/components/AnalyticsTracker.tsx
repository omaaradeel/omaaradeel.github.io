"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getVisitorId,
  getVisitCount,
  incrementVisitCount,
  getFirstVisitTimestamp,
  detectDevice,
  fetchGeoIP,
  upsertSession,
  getStoredSessions,
  saveSessions,
  VisitorSession,
  getCloudConfig,
} from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Exclude analytics dashboard itself from tracking
    if (pathname && pathname.includes("/analytics")) {
      return;
    }

    const visitorId = getVisitorId();
    const sessionKey = "oa_current_session_id";
    let sessionId = sessionStorage.getItem(sessionKey);
    let isNewSession = false;

    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem(sessionKey, sessionId);
      isNewSession = true;
    }

    const visitCount = isNewSession ? incrementVisitCount() : getVisitCount();
    const firstVisit = getFirstVisitTimestamp();
    const device = detectDevice();
    const startTime = Date.now();
    let accumulatedSeconds = 0;

    let currentSession: VisitorSession = {
      id: sessionId,
      visitorId,
      ip: "Detecting...",
      city: "Resolving...",
      region: "...",
      country: "Global",
      countryCode: "UN",
      flag: "🌐",
      isp: "Connecting...",
      org: "Network",
      lat: 0,
      lon: 0,
      browser: device.browser,
      os: device.os,
      deviceType: device.deviceType,
      screen: device.screen,
      referrer: document.referrer || "Direct",
      firstVisit,
      lastActive: Date.now(),
      durationSeconds: 0,
      visitCount,
      path: pathname || "/",
      isLive: true,
    };

    // Save initial placeholder session
    upsertSession(currentSession);

    // Fetch real IP and Geo asynchronously
    fetchGeoIP().then((geo) => {
      if (geo) {
        currentSession = {
          ...currentSession,
          ip: geo.ip,
          city: geo.city,
          region: geo.region,
          country: geo.country,
          countryCode: geo.countryCode,
          flag: geo.flag,
          isp: geo.isp,
          org: geo.org,
          lat: geo.lat,
          lon: geo.lon,
        };
        upsertSession(currentSession);
        syncToCloud(currentSession);
      }
    });

    // Pulse dwell time every 3 seconds
    const interval = setInterval(() => {
      accumulatedSeconds = Math.floor((Date.now() - startTime) / 1000);
      currentSession.durationSeconds = accumulatedSeconds;
      currentSession.lastActive = Date.now();
      currentSession.isLive = true;
      upsertSession(currentSession);
    }, 3000);

    // Flush on unload or tab hide
    const handleFlush = () => {
      accumulatedSeconds = Math.floor((Date.now() - startTime) / 1000);
      currentSession.durationSeconds = accumulatedSeconds;
      currentSession.lastActive = Date.now();
      currentSession.isLive = false;
      upsertSession(currentSession);
      syncToCloud(currentSession);
    };

    window.addEventListener("beforeunload", handleFlush);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleFlush();
      } else {
        currentSession.isLive = true;
        upsertSession(currentSession);
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleFlush);
      handleFlush();
    };
  }, [pathname]);

  return null;
}

// Synchronize session telemetry to /api/analytics endpoint
async function syncToCloud(session: VisitorSession) {
  try {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore if offline
  }

  const config = getCloudConfig();
  if (config.webhookUrl) {
    try {
      fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
        mode: "no-cors",
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore
    }
  }
}
