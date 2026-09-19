"use client";

import { useEffect, useState, useMemo } from "react";
import {
  VisitorSession,
  getStoredSessions,
  saveSessions,
  formatDuration,
  formatRelativeTime,
  getCloudConfig,
  saveCloudConfig,
  CloudSyncConfig,
  fetchGeoIP,
} from "@/lib/analytics";

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "live" | "repeat">("all");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [cloudConfig, setCloudConfigState] = useState<CloudSyncConfig>({});
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Load stored sessions (purges any mock data from previous sessions)
  const refreshData = () => {
    const stored = getStoredSessions();
    // Exclude any mock/sample sessions (e.g. starting with sess_global_ or sess_manual_)
    const realSessions = stored.filter(
      (s) => !s.id.startsWith("sess_global_") && !s.id.startsWith("sess_manual_")
    );
    if (realSessions.length !== stored.length) {
      saveSessions(realSessions);
    }
    setSessions([...realSessions]);
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    refreshData();
    setCloudConfigState(getCloudConfig());

    // Auto-refresh every 4 seconds to reflect live dwell times
    const timer = setInterval(() => {
      refreshData();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Compute live active sessions (active within last 25 seconds)
  const now = Date.now();
  const activeSessions = sessions.map((s) => ({
    ...s,
    isLive: now - s.lastActive < 25000,
  }));

  // Filtering
  const filteredSessions = useMemo(() => {
    return activeSessions.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        s.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.isp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.browser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.os.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (filterType === "live") return s.isLive;
      if (filterType === "repeat") return s.visitCount > 1;
      return true;
    });
  }, [activeSessions, searchQuery, filterType]);

  // Aggregate Metrics
  const totalUniqueVisitors = new Set(sessions.map((s) => s.visitorId || s.ip)).size;
  const totalSessionsCount = sessions.reduce((acc, s) => acc + (s.visitCount || 1), 0);
  const totalDurationSecs = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const avgDurationSecs = sessions.length > 0 ? Math.round(totalDurationSecs / sessions.length) : 0;
  const liveCount = activeSessions.filter((s) => s.isLive).length;

  // Country Breakdown
  const countryCounts = useMemo(() => {
    const map: Record<string, { count: number; flag: string }> = {};
    sessions.forEach((s) => {
      if (!map[s.country]) {
        map[s.country] = { count: 0, flag: s.flag || "🌐" };
      }
      map[s.country].count += 1;
    });
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count);
  }, [sessions]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedId(id);
    setTimeout(() => setIsCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = [
      "Session ID",
      "Visitor ID",
      "IP Address",
      "City",
      "Country",
      "ISP",
      "Browser",
      "OS",
      "Visit Count",
      "Duration (Sec)",
      "First Visit",
      "Last Active",
    ];
    const rows = sessions.map((s) => [
      s.id,
      s.visitorId,
      s.ip,
      `"${s.city}"`,
      `"${s.country}"`,
      `"${s.isp}"`,
      s.browser,
      s.os,
      s.visitCount,
      s.durationSeconds,
      new Date(s.firstVisit).toISOString(),
      new Date(s.lastActive).toISOString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `omar_adel_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to purge all stored analytics logs?")) {
      saveSessions([]);
      setSessions([]);
    }
  };

  const handleSaveCloudConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudConfig(cloudConfig);
    setShowSettings(false);
    alert("Cloud Sync settings successfully saved!");
  };

  return (
    <div className="min-h-screen w-full bg-[#070707] text-white p-4 sm:p-8 md:p-12 font-sans selection:bg-red-500/30 selection:text-white">
      {/* Top Telemetry Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-red-500 font-bold tracking-widest uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>SYS_INTELLIGENCE // REAL-TIME TELEMETRY</span>
          </div>
          <h1 className="font-space-grotesk text-3xl sm:text-5xl font-extrabold tracking-tight">
            VISITOR ANALYTICS
          </h1>
          <p className="font-mono text-xs text-white/50 mt-1">
            Live sensor feed: Real IP resolution, geolocation coordinates, visit frequency, and dwell time.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={refreshData}
            className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>SYNC NOW</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono transition-colors"
          >
            EXPORT CSV
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            title="Cloud Sync Settings"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          <button
            onClick={handleClear}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500 text-white/50 hover:text-red-400 transition-colors"
            title="Clear Logs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </header>

      {/* Cloud Sync Drawer Modal */}
      {showSettings && (
        <div className="max-w-7xl mx-auto my-6 p-6 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-xl animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-space-grotesk text-lg font-bold text-white flex items-center gap-2">
              <span>CLOUD SYNC CONNECTOR</span>
              <span className="font-mono text-xs text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/30">
                MULTI-DEVICE
              </span>
            </h3>
            <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white">
              ✕
            </button>
          </div>
          <p className="text-xs text-white/70 mb-4 max-w-2xl font-mono">
            Connect a free Supabase table or custom Webhook to synchronize visitor telemetry across all devices globally in real-time.
          </p>
          <form onSubmit={handleSaveCloudConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-white/60 mb-1">SUPABASE URL (OPTIONAL)</label>
              <input
                type="text"
                placeholder="https://xyz.supabase.co"
                value={cloudConfig.supabaseUrl || ""}
                onChange={(e) => setCloudConfigState({ ...cloudConfig, supabaseUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-white/60 mb-1">SUPABASE ANON KEY (OPTIONAL)</label>
              <input
                type="text"
                placeholder="eyJhbGciOi..."
                value={cloudConfig.supabaseAnonKey || ""}
                onChange={(e) => setCloudConfigState({ ...cloudConfig, supabaseAnonKey: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-red-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg bg-white/5 text-xs font-mono"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-colors"
              >
                SAVE CONFIG
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards Grid */}
      <section className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
        {/* Unique Visitors */}
        <div className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-red-500/40 transition-colors">
          <div className="font-mono text-[10px] text-white/50 tracking-wider uppercase mb-1">
            UNIQUE VISITORS
          </div>
          <div className="font-space-grotesk text-3xl sm:text-4xl font-black text-white">
            {totalUniqueVisitors}
          </div>
          <div className="font-mono text-[10px] text-red-400 mt-2 flex items-center gap-1">
            <span>[ + ]</span>
            <span>DISTINCT DIGITAL IDENTITIES</span>
          </div>
        </div>

        {/* Live Active */}
        <div className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-red-500/40 transition-colors">
          <div className="font-mono text-[10px] text-white/50 tracking-wider uppercase mb-1 flex items-center justify-between">
            <span>CURRENTLY BROWSING</span>
            {liveCount > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
          </div>
          <div className="font-space-grotesk text-3xl sm:text-4xl font-black text-red-500 flex items-center gap-2">
            {liveCount}
            <span className="font-mono text-xs text-white/60 font-normal">ACTIVE</span>
          </div>
          <div className="font-mono text-[10px] text-white/50 mt-2">
            <span>HEARTBEAT PULSE: 3s</span>
          </div>
        </div>

        {/* Total Opens / Pageviews */}
        <div className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-red-500/40 transition-colors">
          <div className="font-mono text-[10px] text-white/50 tracking-wider uppercase mb-1">
            TOTAL PAGE OPENS
          </div>
          <div className="font-space-grotesk text-3xl sm:text-4xl font-black text-white">
            {totalSessionsCount}
          </div>
          <div className="font-mono text-[10px] text-white/50 mt-2">
            <span>ACCUMULATED VISITS</span>
          </div>
        </div>

        {/* Avg Time Stayed */}
        <div className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-red-500/40 transition-colors">
          <div className="font-mono text-[10px] text-white/50 tracking-wider uppercase mb-1">
            AVG DWELL TIME
          </div>
          <div className="font-space-grotesk text-3xl sm:text-4xl font-black text-white">
            {formatDuration(avgDurationSecs)}
          </div>
          <div className="font-mono text-[10px] text-red-400 mt-2">
            <span>TOTAL: {formatDuration(totalDurationSecs)}</span>
          </div>
        </div>
      </section>

      {/* Main Content Area: Geographic Ticker & Telemetry Logs */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Geographic Distribution */}
        <aside className="lg:col-span-1 p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col">
          <div className="flex items-center gap-2 font-mono text-xs text-red-500 font-bold tracking-wider mb-4 uppercase">
            <span>[ + ]</span>
            <span>TOP GEOLOCATIONS</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
            {countryCounts.map(([country, data]) => {
              const pct = Math.round((data.count / sessions.length) * 100) || 0;
              return (
                <div key={country} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 font-medium text-white/90">
                      <span className="text-base">{data.flag}</span>
                      <span className="truncate max-w-[130px]">{country}</span>
                    </span>
                    <span className="font-mono text-white/60">
                      {data.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 font-mono text-[11px] text-white/40 flex justify-between">
            <span>RESOLUTION: REAL IP</span>
            <span>PROVIDER: IPWHOIS</span>
          </div>
        </aside>

        {/* Right Column: Detailed Visitor Log Table */}
        <section className="lg:col-span-3 p-5 sm:p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col">
          {/* Table Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-space-grotesk text-lg font-bold">
                VISITOR INTELLIGENCE LOG
              </span>
              <span className="font-mono text-xs text-white/40">
                ({filteredSessions.length} RECORDS)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Search input */}
              <div className="relative flex-1 sm:w-56">
                <input
                  type="text"
                  placeholder="Filter IP, country, device..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-red-500 outline-none"
                />
              </div>

              {/* Status Filter buttons */}
              <div className="flex rounded-lg bg-white/5 border border-white/15 p-0.5">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded ${
                    filterType === "all" ? "bg-red-600 text-white font-bold" : "text-white/60 hover:text-white"
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilterType("live")}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1 ${
                    filterType === "live" ? "bg-red-600 text-white font-bold" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  LIVE
                </button>
                <button
                  onClick={() => setFilterType("repeat")}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded ${
                    filterType === "repeat" ? "bg-red-600 text-white font-bold" : "text-white/60 hover:text-white"
                  }`}
                >
                  REPEATS
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[11px] text-white/50 tracking-wider">
                  <th className="pb-3 font-normal">VISITOR / IP</th>
                  <th className="pb-3 font-normal">GEOLOCATION</th>
                  <th className="pb-3 font-normal">OPENS</th>
                  <th className="pb-3 font-normal">TIME STAYED</th>
                  <th className="pb-3 font-normal">ENVIRONMENT</th>
                  <th className="pb-3 font-normal text-right">LAST ACTIVE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-white/40 font-mono">
                      NO TELEMETRY MATCHES CURRENT FILTERS
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* IP / Identity */}
                      <td className="py-4 pr-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              session.isLive ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-neutral-600"
                            }`}
                          />
                          <button
                            onClick={() => handleCopy(session.ip, session.id)}
                            className="font-mono text-sm font-bold text-white hover:text-red-400 transition-colors flex items-center gap-1.5"
                            title="Click to copy IP"
                          >
                            <span>{session.ip}</span>
                            {isCopiedId === session.id ? (
                              <span className="text-[10px] text-red-400">✓ COPIED</span>
                            ) : (
                              <svg className="w-3 h-3 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="font-mono text-[10px] text-white/40 pl-4 truncate max-w-[160px]">
                          {session.isp || session.org || "Network Unknown"}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{session.flag}</span>
                          <span className="font-medium text-white">
                            {session.city}, {session.country}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-white/40">
                          {session.lat && session.lon
                            ? `${session.lat.toFixed(2)}°, ${session.lon.toFixed(2)}°`
                            : session.region}
                        </div>
                      </td>

                      {/* Opens / Visits */}
                      <td className="py-4 pr-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                            session.visitCount > 3
                              ? "bg-red-500/20 text-red-400 border border-red-500/40"
                              : "bg-white/10 text-white/80"
                          }`}
                        >
                          {session.visitCount} {session.visitCount === 1 ? "open" : "opens"}
                        </span>
                      </td>

                      {/* Time Stayed (Dwell Time) */}
                      <td className="py-4 pr-3">
                        <div className="font-mono text-sm font-bold text-red-400">
                          {formatDuration(session.durationSeconds)}
                        </div>
                        <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-red-500"
                            style={{
                              width: `${Math.min((session.durationSeconds / 600) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Environment / Device */}
                      <td className="py-4 pr-3">
                        <div className="font-mono text-white/90">
                          {session.browser} / {session.os}
                        </div>
                        <div className="font-mono text-[10px] text-white/40 uppercase">
                          {session.deviceType} • {session.screen}
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-4 text-right">
                        <div className="font-mono text-white/90">
                          {formatRelativeTime(session.lastActive)}
                        </div>
                        <div className="font-mono text-[10px] text-white/40">
                          {new Date(session.lastActive).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Footer System Stamp */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[11px] text-white/40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>SECURITY CLASSIFICATION: CONFIDENTIAL // OMAR ADEL TELEMETRY</span>
        </div>
        <div>
          URL: omar-adel.me/analytics/ • LAST SYNC: {lastRefreshed.toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
}
