import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { ITask } from "src/app/shared/interfaces/task.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ILane } from "../interface/lane";

@Component({
  selector: "[board-dnd-list]",
  templateUrl: "./board-dnd-list.component.html",
  styleUrls: ["./board-dnd-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BoardDndListComponent implements OnChanges {
  @Input() lane: ILane;
  private readonly refreshLane$ = new BehaviorSubject<void>(null);

  ngOnChanges(changes: SimpleChanges): void {
    this.lane = changes.lane.currentValue;
    this.refreshLane$.next();
  }
}
