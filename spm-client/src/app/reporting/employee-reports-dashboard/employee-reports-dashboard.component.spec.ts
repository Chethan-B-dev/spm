import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReportsDashboardComponent } from './employee-reports-dashboard.component';

describe('EmployeeReportsDashboardComponent', () => {
  let component: EmployeeReportsDashboardComponent;
  let fixture: ComponentFixture<EmployeeReportsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeReportsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeReportsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
