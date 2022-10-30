import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, Subject } from "rxjs";
import { catchError, map, takeUntil } from "rxjs/operators";
import { ILane } from "src/app/manager/manager-scrum-board/interface/lane";
import {
  ITodo,
  TodoStatusOptions,
} from "src/app/shared/interfaces/todo.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
@Component({
  selector: "app-board-dnd",
  templateUrl: "./board-dnd.component.html",
  styleUrls: ["./board-dnd.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardDndComponent implements OnInit {
  @Input() todos: ITodo[];
  @Input() taskId: number;
  @Input() canDrag: boolean;
  lanes$: Observable<ILane[]>;
  private readonly refreshLane$ = new BehaviorSubject<void>(null);
  private readonly destroy$ = new Subject<void>();
  constructor(private readonly snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.lanes$ = this.refreshLane$.pipe(
      takeUntil(this.destroy$),
      map(() => this.getLanes()),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.todos || changes.canDrag) {
      this.refreshLane$.next();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getLanes(): ILane[] {
    return TodoStatusOptions.map((todoStatus) => ({
      title: todoStatus.replace("_", " "),
      todos: this.todos
        .filter((todo) => todo.status === todoStatus)
        .sort((a, b) => b.id - a.id),
    }));
  }
}
