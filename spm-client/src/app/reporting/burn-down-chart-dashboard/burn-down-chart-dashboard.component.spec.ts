import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnDownChartDashboardComponent } from './burn-down-chart-dashboard.component';

describe('BurnDownChartDashboardComponent', () => {
  let component: BurnDownChartDashboardComponent;
  let fixture: ComponentFixture<BurnDownChartDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BurnDownChartDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnDownChartDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
