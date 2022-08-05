import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from "@angular/fire/storage";
import * as firebase from "firebase";
import { EMPTY, Observable, Subject, Subscription } from "rxjs";
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "../interfaces/project.interface";
import { SnackbarService } from "../services/snackbar.service";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
})
export class UploadComponent implements OnInit, OnDestroy {
  @Input() file: File;
  @Input() project: IProject;
  @Output() projectEvent = new EventEmitter<IProject>();
  @Output() errorEvent = new EventEmitter<any>();

  task: AngularFireUploadTask;
  uploadPercent$: Observable<number>;
  snapshot$: Observable<firebase.storage.UploadTaskSnapshot>;
  downloadURL: string;

  private readonly subscriptions = [] as Subscription[];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly storage: AngularFireStorage,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.startUpload();
  }

  private startUpload() {
    // The storage path
    const path = `project/${this.project.name}/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.uploadPercent$ = this.task.percentageChanges();

    this.snapshot$ = this.task.snapshotChanges().pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        this.errorEvent.emit(err);
        return EMPTY;
      }),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.editProject(this.downloadURL);
      })
    );
  }

  private editProject(url: string): void {
    let files = JSON.parse(this.project.files);

    if (!files) files = [];

    files.push(url);

    const editProjectSubscription = this.managerService
      .editProject(
        this.project.id,
        this.project.name,
        this.project.description,
        this.project.toDate,
        this.project.status,
        JSON.stringify(files)
      )
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.errorEvent.emit(err);
          return EMPTY;
        })
      )
      .subscribe((project) => this.projectEvent.emit(project));

    this.subscriptions.push(editProjectSubscription);
  }

  bytesToMegaBytes(bytes): number {
    return bytes / 1024 ** 2;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
