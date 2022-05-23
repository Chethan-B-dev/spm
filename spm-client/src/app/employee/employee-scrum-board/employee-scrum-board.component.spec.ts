import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScrumBoardComponent } from './employee-scrum-board.component';

describe('EmployeeScrumBoardComponent', () => {
  let component: EmployeeScrumBoardComponent;
  let fixture: ComponentFixture<EmployeeScrumBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeScrumBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeScrumBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
