import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
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

  getAllNotifications(): Observable<any> {
    return this.store
      .collection(this.COLLECTION_NAME)
      .snapshotChanges()
      .pipe(catchError(handleError));
  }

  addNotification(notification: INotification): void {
    // todo: uncomment this if you want notifications enabled
    return;
    this.store
      .collection(this.COLLECTION_NAME)
      .add(notification)
      .catch((err) => this.snackbarService.showSnackBar(err.message));
  }

  deleteNotification(notificationId: string): void {
    // todo: uncomment this if you want notifications enabled
    return;
    this.store
      .collection(this.COLLECTION_NAME)
      .doc(notificationId)
      .delete()
      .catch((err) => this.snackbarService.showSnackBar(err.message));
  }
}
