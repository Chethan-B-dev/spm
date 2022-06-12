import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressReportsDashboardComponent } from './progress-reports-dashboard.component';

describe('ProgressReportsDashboardComponent', () => {
  let component: ProgressReportsDashboardComponent;
  let fixture: ComponentFixture<ProgressReportsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressReportsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressReportsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
