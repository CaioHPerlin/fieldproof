import { SQLiteDatabase } from "expo-sqlite";
import { Attachment, NewAttachmentInput } from "../types/attachment";

export async function findAttachmentsByInspectionId(
  db: SQLiteDatabase,
  inspectionId: number,
): Promise<Attachment[]> {
  const result = await db.getAllAsync<Attachment>(
    "SELECT * FROM attachments WHERE inspectionId = ? ORDER BY timestamp DESC",
    [inspectionId],
  );
  return result;
}

export async function countAttachmentsByInspectionId(
  db: SQLiteDatabase,
  inspectionId: number,
): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM attachments WHERE inspectionId = ?",
    [inspectionId],
  );
  return result?.count ?? 0;
}

export async function insertAttachment(
  db: SQLiteDatabase,
  attachment: NewAttachmentInput,
): Promise<number> {
  const result = await db.runAsync(
    "INSERT INTO attachments (inspectionId, imageBase64, annotation, latitude, longitude, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
    [
      attachment.inspectionId,
      attachment.imageBase64,
      attachment.annotation,
      attachment.latitude,
      attachment.longitude,
      attachment.timestamp,
    ],
  );
  return result.lastInsertRowId;
}

export async function deleteAttachment(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync("DELETE FROM attachments WHERE id = ?", [id]);
}
