import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTaskDetailComponent } from './employee-task-detail.component';

describe('EmployeeTaskDetailComponent', () => {
  let component: EmployeeTaskDetailComponent;
  let fixture: ComponentFixture<EmployeeTaskDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTaskDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
