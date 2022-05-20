import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIssueDetailComponent } from './employee-issue-detail.component';

describe('EmployeeIssueDetailComponent', () => {
  let component: EmployeeIssueDetailComponent;
  let fixture: ComponentFixture<EmployeeIssueDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeIssueDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeIssueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
