import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Observable, fromEvent, merge, EMPTY } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { mapTo, startWith } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ConnectionService {
  private connectionMonitor: Observable<boolean>;

  constructor(@Inject(PLATFORM_ID) platform) {
    if (isPlatformBrowser(platform)) {
      const offline$ = fromEvent(window, "offline").pipe(
        startWith(!window.navigator.onLine),
        mapTo(false)
      );
      const online$ = fromEvent(window, "online").pipe(
        startWith(window.navigator.onLine),
        mapTo(true)
      );
      this.connectionMonitor = merge(offline$, online$);
    } else {
      this.connectionMonitor = EMPTY;
    }
  }

  monitor(): Observable<boolean> {
    return this.connectionMonitor;
  }
}
