import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeProjectDetailComponent } from './employee-project-detail.component';

describe('EmployeeProjectDetailComponent', () => {
  let component: EmployeeProjectDetailComponent;
  let fixture: ComponentFixture<EmployeeProjectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeProjectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
