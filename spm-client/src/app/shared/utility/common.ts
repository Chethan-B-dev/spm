export enum DeleteType {
  TODO = "TODO",
  USER = "USER",
}

export interface DeleteData {
  deleteType: DeleteType;
  id: number;
}
