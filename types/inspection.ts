export type Inspection = {
  id: number;
  title: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  date: string;
};

export type NewInspectionInput = Omit<Inspection, "id">;
