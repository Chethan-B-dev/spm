import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

export function handleError(
  err: HttpErrorResponse | string,
  callBack: (err: string) => void
): Observable<never> {
  let errorMessage: string;
  if (typeof err === "string") {
    errorMessage = err;
  } else if (err.error && err.error.message) {
    errorMessage = err.error.message;
  } else {
    switch (err.status) {
      case 404:
        errorMessage = `Not Found: ${err.message}`;
        break;
      case 403:
        errorMessage = `Access Denied: ${err.message}`;
        break;
      case 500:
        errorMessage = `Internal Server Error: ${err.message}`;
        break;
      default:
        errorMessage = `Unknown Server Error:  ${err.status} : ${err.message}`;
    }
  }
  console.error(err);
  callBack(errorMessage);
  return throwError(errorMessage);
}
