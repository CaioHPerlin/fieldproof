import { SQLiteDatabase } from "expo-sqlite";

export async function init(db: SQLiteDatabase): Promise<void> {
  // await db.execAsync(`
  //  DELETE FROM inspections;
  // `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inspections (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,     
      address     TEXT NOT NULL,   
      latitude    REAL,               
      longitude   REAL,
      date        TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inspectionId INTEGER NOT NULL,
      imageBase64 TEXT NOT NULL,
      annotation TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (inspectionId)
        REFERENCES inspections(id)
        ON DELETE CASCADE
    );
  `);
}
