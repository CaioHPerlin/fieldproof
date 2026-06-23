import { SQLiteDatabase } from "expo-sqlite";
import { Inspection, NewInspectionInput } from "../types/inspection";

export async function findAllInspections(db: SQLiteDatabase): Promise<Inspection[]> {
  const result = await db.getAllAsync<Inspection>("SELECT * FROM inspections ORDER BY date DESC");
  return result;
}

export async function findInspectionById(
  db: SQLiteDatabase,
  id: number,
): Promise<Inspection | null> {
  const result = await db.getFirstAsync<Inspection>("SELECT * FROM inspections WHERE id = ?", [id]);
  return result ?? null;
}

export async function insertInspection(
  db: SQLiteDatabase,
  inspection: NewInspectionInput,
): Promise<number> {
  const result = await db.runAsync(
    "INSERT INTO inspections (title, location, date) VALUES (?, ?, ?)",
    [inspection.title, inspection.location, inspection.date],
  );
  return result.lastInsertRowId;
}

export async function updateInspection(
  db: SQLiteDatabase,
  id: number,
  inspection: Partial<NewInspectionInput>,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number)[] = [];
  if (inspection.title !== undefined) {
    fields.push("title = ?");
    values.push(inspection.title);
  }
  if (inspection.location !== undefined) {
    fields.push("location = ?");
    values.push(inspection.location);
  }
  if (inspection.date !== undefined) {
    fields.push("date = ?");
    values.push(inspection.date);
  }
  if (fields.length === 0) return;
  values.push(id);
  await db.runAsync(`UPDATE inspections SET ${fields.join(", ")} WHERE id = ?`, values);
}

export async function deleteInspection(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync("DELETE FROM inspections WHERE id = ?", [id]);
}
