import { Inspection } from "./inspection";

export type Attachment = {
  id: number;
  inspectionId: Inspection["id"];
  imageBase64: string;
  annotation: string;
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
};

export type NewAttachmentInput = Omit<Attachment, "id">;
