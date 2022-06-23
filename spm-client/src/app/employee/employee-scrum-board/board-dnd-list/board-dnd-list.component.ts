import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { BehaviorSubject, EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { ILane } from "src/app/manager/manager-scrum-board/interface/lane";
import {
  ITodo,
  IUpdateTodoDTO,
  TodoStatus,
} from "src/app/shared/interfaces/todo.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { EmployeeService } from "../../employee.service";

@Component({
  selector: "[board-dnd-list]",
  templateUrl: "./board-dnd-list.component.html",
  styleUrls: ["./board-dnd-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BoardDndListComponent implements OnChanges, OnDestroy {
  @Input() lane: ILane;
  @Input() taskId: number;
  private readonly refreshLane$ = new BehaviorSubject<void>(null);
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.lane = changes.lane.currentValue;
    this.refreshLane$.next();
  }

  drop(event: CdkDragDrop<any>) {
    let isMovingInsideTheSameList = event.previousContainer === event.container;
    if (isMovingInsideTheSameList) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const todo: ITodo = event.item.data;
      const movedToLane: string = event.container.id.replace(" ", "_");
      const updateTodoDto: IUpdateTodoDTO = {
        todoName: todo.name,
        taskId: this.taskId,
        status: movedToLane as TodoStatus,
      };
      this.employeeService
        .updateTodo(updateTodoDto, todo.id)
        .pipe(
          takeUntil(this.destroy$),
          catchError((err) => {
            this.snackbarService.showSnackBar(err);
            return EMPTY;
          })
        )
        .subscribe(() =>
          this.snackbarService.showSnackBar(
            `todo moved to ${movedToLane.replace("_", " ")}`
          )
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
