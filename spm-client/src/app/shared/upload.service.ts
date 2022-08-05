import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: "root",
})
export class UploadService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: AngularFireStorage
  ) {}

  uploadFile(file: File) {}
}
