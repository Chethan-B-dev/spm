import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

export function handleError(err: HttpErrorResponse): Observable<never> {
  let errorMessage: string;
  if (err.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    errorMessage = err.error.message;
  } else {
    if (err.error.hasOwnProperty("message")) errorMessage = err.error.message;
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    else errorMessage = `Backend returned code ${err.status}: ${err.message}`;
  }

  console.error(err);
  return throwError(errorMessage);
}
