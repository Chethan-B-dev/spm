import { Component, OnInit } from '@angular/core';
import { JLane, MOCK_LANES } from "../interface/lane";
@Component({
  selector: 'board-dnd',
  templateUrl: './board-dnd.component.html',
  styleUrls: ['./board-dnd.component.scss']
})
export class BoardDndComponent implements OnInit {
  lanes: JLane[] =MOCK_LANES;
  constructor() { }

  ngOnInit() {
    this.lanes = MOCK_LANES;
  }

}
