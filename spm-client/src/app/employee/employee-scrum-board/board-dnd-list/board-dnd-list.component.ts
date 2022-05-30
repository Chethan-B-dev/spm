import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { JLane, JIssue } from '../interface/lane';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-board-dnd-list',
  templateUrl: './board-dnd-list.component.html',
  styleUrls: ['./board-dnd-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardDndListComponent implements OnInit {
  @Input() lane: JLane;
  constructor() { }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<JIssue[]>) {
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
