export enum Field {
  AVAILABLE = "AVAILABLE",
  VISIBLE = "VISIBLE",
}

export interface ColumnData {
  name: string;
  fieldType: Field;
}

export const AdminColumns: ColumnData[] = [
  { name: "username", fieldType: Field.VISIBLE },
  { name: "email", fieldType: Field.VISIBLE },
  { name: "role", fieldType: Field.VISIBLE },
  { name: "status", fieldType: Field.VISIBLE },
  { name: "phone", fieldType: Field.AVAILABLE },
  { name: "designation", fieldType: Field.AVAILABLE },
];
