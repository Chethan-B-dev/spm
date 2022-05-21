import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { ManagerService } from "../services/manager.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  typesOfShoes: string[] = ["hello", "world"];
  createdDate: Date = new Date();
  deadLine: Date = new Date();
  isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private readonly destroy$ = new Subject();

  get isLoading$() {
    return this.isLoadingSubject.asObservable();
  }

  projects$ = this.managerService.refresh.pipe(
    takeUntil(this.destroy$),
    switchMap(() => this.managerService.getAllProjects())
  );

  constructor(private managerService: ManagerService) {}

  ngOnInit() {}
}
