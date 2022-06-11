import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EachProjectProgressBoardComponent } from './each-project-progress-board.component';

describe('EachProjectProgressBoardComponent', () => {
  let component: EachProjectProgressBoardComponent;
  let fixture: ComponentFixture<EachProjectProgressBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EachProjectProgressBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EachProjectProgressBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
