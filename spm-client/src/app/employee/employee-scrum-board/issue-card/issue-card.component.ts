import { Component, Input, OnInit } from '@angular/core';
import { JIssue } from '../interface/lane';
@Component({
  selector: 'issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.scss']
})
export class IssueCardComponent implements OnInit {
  @Input() issue: JIssue;
  constructor() { }

  ngOnInit() {
  }

}
