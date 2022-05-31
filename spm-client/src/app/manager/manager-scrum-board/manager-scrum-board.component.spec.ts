import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerScrumBoardComponent } from './manager-scrum-board.component';

describe('ManagerScrumBoardComponent', () => {
  let component: ManagerScrumBoardComponent;
  let fixture: ComponentFixture<ManagerScrumBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerScrumBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerScrumBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
