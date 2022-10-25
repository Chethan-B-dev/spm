import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";
import { ILane } from "../interface/lane";

@Component({
  selector: "[board-dnd-list]",
  templateUrl: "./board-dnd-list.component.html",
  styleUrls: ["./board-dnd-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardDndListComponent {
  @Input() lane: ILane;
}
