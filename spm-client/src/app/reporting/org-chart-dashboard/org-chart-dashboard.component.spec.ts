import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgChartDashboardComponent } from './org-chart-dashboard.component';

describe('OrgChartDashboardComponent', () => {
  let component: OrgChartDashboardComponent;
  let fixture: ComponentFixture<OrgChartDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgChartDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgChartDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
