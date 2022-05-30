import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDndListComponent } from './board-dnd-list.component';

describe('BoardDndListComponent', () => {
  let component: BoardDndListComponent;
  let fixture: ComponentFixture<BoardDndListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardDndListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardDndListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
