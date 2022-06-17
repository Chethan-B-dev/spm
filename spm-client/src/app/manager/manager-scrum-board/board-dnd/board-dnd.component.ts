import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, of, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import {
  ITodo,
  TodoStatusOptions,
} from "src/app/shared/interfaces/todo.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ILane } from "../interface/lane";

@Component({
  selector: "board-dnd",
  templateUrl: "./board-dnd.component.html",
  styleUrls: ["./board-dnd.component.scss"],
})
export class BoardDndComponent implements OnInit, OnChanges, OnDestroy {
  @Input() todos: ITodo[];
  lanes$: Observable<ILane[]>;
  private readonly refreshLane$ = new BehaviorSubject<void>(null);
  private readonly destroy$ = new Subject<void>();
  constructor(private readonly snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.lanes$ = this.refreshLane$.pipe(
      takeUntil(this.destroy$),
      switchMap(() =>
        of(
          TodoStatusOptions.map((todoStatus) => ({
            title: todoStatus.replace("_", " "),
            todos: this.todos
              .filter((todo) => todo.status === todoStatus)
              .sort((a, b) => b.id - a.id),
          }))
        )
      ),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.todos = changes.todos.currentValue;
    this.refreshLane$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
