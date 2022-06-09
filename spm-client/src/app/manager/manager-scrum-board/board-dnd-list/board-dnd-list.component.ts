import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { ILane } from "../interface/lane";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { ITask } from "src/app/shared/interfaces/task.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { BehaviorSubject, Subject } from "rxjs";

@Component({
  selector: "[board-dnd-list]",
  templateUrl: "./board-dnd-list.component.html",
  styleUrls: ["./board-dnd-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BoardDndListComponent implements OnInit, OnChanges {
  @Input() lane: ILane;
  private readonly refreshLane$ = new BehaviorSubject<void>(null);
  private readonly destroy$ = new Subject<void>();
  constructor(private snackbarService: SnackbarService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.lane = changes.lane.currentValue;
    this.refreshLane$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  drop(event: CdkDragDrop<ITask[]>) {
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
    }
  }
}
