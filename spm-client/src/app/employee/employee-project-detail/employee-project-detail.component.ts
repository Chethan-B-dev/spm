import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import {ThemePalette} from '@angular/material/core';
import { CreateIssueComponent } from './Dialogs/create-issue/create-issue.component';



export interface ChipColor {
  name: string;
  color: ThemePalette;
}
@Component({
  selector: 'app-employee-project-detail',
  templateUrl: './employee-project-detail.component.html',
  styleUrls: ['./employee-project-detail.component.scss']
})
export class EmployeeProjectDetailComponent implements OnInit {

  availableColors: ChipColor[] = [
    {name: 'Status: In-progress', color: undefined},
    {name: 'Deadline: 15/06/2022', color: 'primary'},
    {name: 'Backlogs: 3', color: 'accent'},
    {name: 'Tasks', color: 'warn'},
  ];
  @Input() value: string;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  createIssue(): void{
    let dialogRef = this.dialog.open(CreateIssueComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      // todo : delete user api call from adminApiService
      // yes returns true
      // no returns false
    });
  }



}


