import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpReportListComponent } from './emp-report-list.component';

describe('EmpReportListComponent', () => {
  let component: EmpReportListComponent;
  let fixture: ComponentFixture<EmpReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
