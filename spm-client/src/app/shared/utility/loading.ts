import { Subject } from "rxjs";

export function stopLoading(loadingSubject: Subject<boolean>): void {
  loadingSubject.next(false);
}

export function startLoading(loadingSubject: Subject<boolean>): void {
  loadingSubject.next(true);
}
