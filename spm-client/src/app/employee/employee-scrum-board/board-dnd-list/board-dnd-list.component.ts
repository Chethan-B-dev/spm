import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import {
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardDndListComponent implements OnChanges, OnDestroy {
  @Input() lane: ILane;
  @Input() taskId: number;
  @Input() canDrag: boolean;
  private readonly refreshLane$ = new BehaviorSubject<void>(null);
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lane || changes.canDrag) {
      this.refreshLane$.next();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  drop(event: CdkDragDrop<any>): void {
    const isMovingInsideTheSameList =
      event.previousContainer === event.container;
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
      const movedToLane = event.container.id.replace(" ", "_");
      const updateTodoDto: IUpdateTodoDTO = {
        todoName: todo.name,
        taskId: this.taskId,
        status: movedToLane as TodoStatus,
      };
      this.updateTodoStatus(updateTodoDto, todo.id);
    }
  }

  private updateTodoStatus(updatedTodo: IUpdateTodoDTO, todoId: number): void {
    this.employeeService
      .updateTodo(updatedTodo, todoId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => EMPTY)
      )
      .subscribe(() => {
        this.snackbarService.showSnackBar(
          `todo moved to ${updatedTodo.status.replace("_", " ")}`
        );
      });
  }
}
