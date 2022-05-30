import { Component, Input, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-employee-scrum-board',
  templateUrl: './employee-scrum-board.component.html',
  styleUrls: ['./employee-scrum-board.component.scss']
})
export class EmployeeScrumBoardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  // todo = ['1.Get to work', '2.Pick up groceries', '3.Go home', '4.Fall asleep'];

  // in_progress = ['Pick up groceries', 'Go home', 'Fall asleep'];

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );

  //   }
  // }
  // panelOpenState = false;



}
