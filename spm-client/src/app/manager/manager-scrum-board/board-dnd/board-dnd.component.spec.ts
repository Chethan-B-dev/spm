import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDndComponent } from './board-dnd.component';

describe('BoardDndComponent', () => {
  let component: BoardDndComponent;
  let fixture: ComponentFixture<BoardDndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardDndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardDndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
