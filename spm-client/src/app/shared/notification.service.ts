import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { INotification } from "./interfaces/notification.interface";
import { SnackbarService } from "./services/snackbar.service";
import { handleError } from "./utility/error";
@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly COLLECTION_NAME = "notifications";
  constructor(
    private readonly store: AngularFirestore,
    private readonly snackbarService: SnackbarService
  ) {}

  getAllNotifications(): Observable<INotification[]> {
    return from(this.store.collection(this.COLLECTION_NAME).ref.get()).pipe(
      map((snapshots) => {
        const notifications = [];
        snapshots.forEach((snapshot) => {
          notifications.push({
            id: snapshot.id,
            ...snapshot.data(),
          } as INotification);
        });
        return notifications;
      }),
      catchError((err) =>
        handleError(err, (errorMessage) => {
          this.snackbarService.showSnackBar(errorMessage);
        })
      )
    );
  }

  getAllNotificationChanges(): Observable<INotification[]> {
    return this.store
      .collection(this.COLLECTION_NAME)
      .snapshotChanges()
      .pipe(
        map((snapshots: any) =>
          snapshots.map(
            (snapshot) =>
              ({
                id: snapshot.payload.doc.id,
                ...snapshot.payload.doc.data(),
              } as INotification)
          )
        ),
        catchError((err) =>
          handleError(err, (errorMessage) => {
            this.snackbarService.showSnackBar(errorMessage);
          })
        )
      );
  }

  addNotification(notification: INotification): void {
    // todo: uncomment this if you want notifications enabled
    return;
    this.store
      .collection(this.COLLECTION_NAME)
      .add(notification)
      .catch((err) =>
        handleError(err, (errorMessage) =>
          this.snackbarService.showSnackBar(errorMessage)
        )
      );
  }

  deleteNotification(notificationId: string): void {
    // todo: uncomment this if you want notifications enabled
    return;
    this.store
      .collection(this.COLLECTION_NAME)
      .doc(notificationId)
      .delete()
      .catch((err) =>
        handleError(err, (errorMessage) =>
          this.snackbarService.showSnackBar(errorMessage)
        )
      );
  }
}
