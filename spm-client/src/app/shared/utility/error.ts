import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

export function handleError(err: HttpErrorResponse): Observable<never> {
  let errorMessage: string;
  if (err.error && err.error.message) errorMessage = err.error.message;
  else errorMessage = `Backend returned code ${err.status}: ${err.message}`;
  console.error(err);
  return throwError(errorMessage);
}
