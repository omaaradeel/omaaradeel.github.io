<?php
/**
 * Omar Adel Portfolio - Real-Time Telemetry API
 * Database: u619415133_me
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Database Credentials
$dbHost = "localhost";
$dbName = "u619415133_me";
$dbUser = "u619415133_me";
$dbPass = "MQxirQ|y1n|";

try {
    $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Automatically create visitor_sessions table if it doesn't exist
    $pdo->exec("
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
    ");

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed", "details" => $e->getMessage()]);
    exit(1);
}

// Handle GET: Fetch real visitor telemetry
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 500) : 150;
    
    $stmt = $pdo->prepare("
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
        LIMIT :limit
    ");
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $sessions = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "count" => count($sessions),
        "sessions" => $sessions
    ]);
    exit(0);
}

// Handle POST: Upsert visitor telemetry
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid payload"]);
        exit(1);
    }

    // Capture real client IP
    $clientIp = $data['ip'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    if ($clientIp === 'Detecting...' || empty($clientIp)) {
        $clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'] 
            ?? $_SERVER['HTTP_X_FORWARDED_FOR'] 
            ?? $_SERVER['REMOTE_ADDR'] 
            ?? '127.0.0.1';
        if (strpos($clientIp, ',') !== false) {
            $clientIp = trim(explode(',', $clientIp)[0]);
        }
    }

    $stmt = $pdo->prepare("
        INSERT INTO visitor_sessions (
            id, visitor_id, ip, city, region, country, country_code, flag, isp, org,
            lat, lon, browser, os, device_type, screen, referrer,
            first_visit, last_active, duration_seconds, visit_count, path
        ) VALUES (
            :id, :visitor_id, :ip, :city, :region, :country, :country_code, :flag, :isp, :org,
            :lat, :lon, :browser, :os, :device_type, :screen, :referrer,
            :first_visit, :last_active, :duration_seconds, :visit_count, :path
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
    ");

    $now = round(microtime(true) * 1000);

    $stmt->execute([
        ':id' => $data['id'],
        ':visitor_id' => $data['visitorId'] ?? ('usr_' . substr(md5($clientIp), 0, 8)),
        ':ip' => $clientIp,
        ':city' => $data['city'] ?? 'Unknown',
        ':region' => $data['region'] ?? 'Unknown',
        ':country' => $data['country'] ?? 'Global',
        ':country_code' => $data['countryCode'] ?? 'UN',
        ':flag' => $data['flag'] ?? '🌐',
        ':isp' => $data['isp'] ?? 'Network',
        ':org' => $data['org'] ?? 'Provider',
        ':lat' => (float)($data['lat'] ?? 0),
        ':lon' => (float)($data['lon'] ?? 0),
        ':browser' => $data['browser'] ?? 'Unknown',
        ':os' => $data['os'] ?? 'Unknown',
        ':device_type' => $data['deviceType'] ?? 'desktop',
        ':screen' => $data['screen'] ?? 'Unknown',
        ':referrer' => substr($data['referrer'] ?? 'Direct', 0, 255),
        ':first_visit' => (int)($data['firstVisit'] ?? $now),
        ':last_active' => (int)($data['lastActive'] ?? $now),
        ':duration_seconds' => (int)($data['durationSeconds'] ?? 0),
        ':visit_count' => (int)($data['visitCount'] ?? 1),
        ':path' => substr($data['path'] ?? '/', 0, 255)
    ]);

    echo json_encode(["status" => "synced", "id" => $data['id']]);
    exit(0);
}
