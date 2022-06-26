import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { INotification } from "./interfaces/notification.interface";
@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly COLLECTION_NAME = "notifications";
  constructor(private store: AngularFirestore) {}

  getAllNotifications(): Observable<any> {
    return this.store.collection(this.COLLECTION_NAME).snapshotChanges();
  }

  addNotification(notification: INotification): void {
    this.store.collection(this.COLLECTION_NAME).add(notification);
  }

  deleteNotification(notificationId: string): void {
    this.store.collection(this.COLLECTION_NAME).doc(notificationId).delete();
  }
}
