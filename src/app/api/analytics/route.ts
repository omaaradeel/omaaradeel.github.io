import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export const dynamic = "force-dynamic";

const dbConfig = {
  host: process.env.DB_HOST || "82.112.229.216",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "u619415133_me",
  password: process.env.DB_PASSWORD || "MQxirQ|y1n|",
  database: process.env.DB_NAME || "u619415133_me",
  connectTimeout: 8000,
};

// Create reusable connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Auto-initialize table schema
let tableInitialized = false;
async function ensureTable() {
  if (tableInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visitor_sessions (
        id VARCHAR(100) PRIMARY KEY,
        visitor_id VARCHAR(100) NOT NULL,
        ip VARCHAR(60) NOT NULL,
        city VARCHAR(100) DEFAULT 'Unknown',
        region VARCHAR(100) DEFAULT 'Unknown',
        country VARCHAR(100) DEFAULT 'Global',
        country_code VARCHAR(10) DEFAULT 'UN',
        flag VARCHAR(10) DEFAULT '🌐',
        isp VARCHAR(150) DEFAULT 'Network',
        org VARCHAR(150) DEFAULT 'Provider',
        lat DECIMAL(10, 6) DEFAULT 0,
        lon DECIMAL(10, 6) DEFAULT 0,
        browser VARCHAR(50) DEFAULT 'Unknown',
        os VARCHAR(50) DEFAULT 'Unknown',
        device_type VARCHAR(20) DEFAULT 'desktop',
        screen VARCHAR(30) DEFAULT 'Unknown',
        referrer VARCHAR(255) DEFAULT 'Direct',
        first_visit BIGINT NOT NULL,
        last_active BIGINT NOT NULL,
        duration_seconds INT DEFAULT 0,
        visit_count INT DEFAULT 1,
        path VARCHAR(255) DEFAULT '/',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_last_active (last_active),
        INDEX idx_visitor_id (visitor_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    tableInitialized = true;
  } catch (err) {
    console.error("Failed to initialize visitor_sessions table:", err);
  }
}

// GET: Fetch visitor telemetry for dashboard
export async function GET(req: NextRequest) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "150", 10), 500);

    const [rows]: [any[], any] = await pool.query(
      `
      SELECT 
        id,
        visitor_id AS visitorId,
        ip,
        city,
        region,
        country,
        country_code AS countryCode,
        flag,
        isp,
        org,
        CAST(lat AS FLOAT) AS lat,
        CAST(lon AS FLOAT) AS lon,
        browser,
        os,
        device_type AS deviceType,
        screen,
        referrer,
        first_visit AS firstVisit,
        last_active AS lastActive,
        duration_seconds AS durationSeconds,
        visit_count AS visitCount,
        path
      FROM visitor_sessions
      ORDER BY last_active DESC
      LIMIT ?
      `,
      [limit]
    );

    return NextResponse.json({
      status: "success",
      count: rows.length,
      sessions: rows,
    });
  } catch (err: any) {
    console.error("GET /api/analytics error:", err);
    return NextResponse.json(
      { error: "Database query failed", details: err.message },
      { status: 500 }
    );
  }
}

// POST: Upsert visitor telemetry from tracker
export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const data = await req.json();

    if (!data || !data.id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Capture real client IP from Vercel / Cloudflare headers if not present
    let clientIp =
      data.ip && data.ip !== "Detecting..."
        ? data.ip
        : req.headers.get("x-real-ip") ||
          req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
          "127.0.0.1";

    const now = Date.now();

    await pool.query(
      `
      INSERT INTO visitor_sessions (
        id, visitor_id, ip, city, region, country, country_code, flag, isp, org,
        lat, lon, browser, os, device_type, screen, referrer,
        first_visit, last_active, duration_seconds, visit_count, path
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      ) ON DUPLICATE KEY UPDATE
        last_active = VALUES(last_active),
        duration_seconds = VALUES(duration_seconds),
        visit_count = VALUES(visit_count),
        path = VALUES(path),
        ip = IF(VALUES(ip) != 'Detecting...', VALUES(ip), ip),
        city = IF(VALUES(city) != 'Resolving...', VALUES(city), city),
        country = IF(VALUES(country) != 'Global', VALUES(country), country),
        flag = IF(VALUES(flag) != '🌐', VALUES(flag), flag),
        isp = IF(VALUES(isp) != 'Connecting...', VALUES(isp), isp)
      `,
      [
        data.id,
        data.visitorId || `usr_${data.id.substring(5, 12)}`,
        clientIp,
        data.city || "Unknown",
        data.region || "Unknown",
        data.country || "Global",
        data.countryCode || "UN",
        data.flag || "🌐",
        data.isp || "Network",
        data.org || "Provider",
        parseFloat(data.lat) || 0,
        parseFloat(data.lon) || 0,
        data.browser || "Unknown",
        data.os || "Unknown",
        data.deviceType || "desktop",
        data.screen || "Unknown",
        data.referrer?.substring(0, 255) || "Direct",
        parseInt(data.firstVisit, 10) || now,
        parseInt(data.lastActive, 10) || now,
        parseInt(data.durationSeconds, 10) || 0,
        parseInt(data.visitCount, 10) || 1,
        data.path?.substring(0, 255) || "/",
      ]
    );

    return NextResponse.json({ status: "synced", id: data.id });
  } catch (err: any) {
    console.error("POST /api/analytics error:", err);
    return NextResponse.json(
      { error: "Database upsert failed", details: err.message },
      { status: 500 }
    );
  }
}
