export type Inspection = {
  id: number;
  title: string;
  location: string;
  date: string;
};

export type NewInspectionInput = Omit<Inspection, "id">;
