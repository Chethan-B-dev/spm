export enum DataType {
  TODO = "TODO",
  USER = "USER",
}

export interface DeleteData {
  deleteType: DataType;
  id: number;
}

export interface PieData<T> {
  type: DataType;
  data: T[];
}

export function myTitleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(" ");
}
