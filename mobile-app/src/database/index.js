import * as SQLite from 'expo-sqlite';

let db;

export async function initDB() {
  try {
    db = await SQLite.openDatabaseAsync('resqlink.db');
    // Create the incidents table if it doesn't exist.
    // 'synced' boolean guarantees offline-first mesh tracking.
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      );
    `);
    console.log("✅ Offline Local Database Initialized");
  } catch (error) {
    console.error("Error initializing local DB:", error);
  }
}

export async function insertIncident(deviceId, severity) {
  if (!db) return null;
  try {
    const timestamp = new Date().toISOString();
    const result = await db.runAsync(
      'INSERT INTO incidents (device_id, timestamp, severity, status, synced) VALUES (?, ?, ?, ?, ?)',
      [deviceId, timestamp, severity, 'pending', 0]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Failed to insert offline incident:", error);
    return null;
  }
}
