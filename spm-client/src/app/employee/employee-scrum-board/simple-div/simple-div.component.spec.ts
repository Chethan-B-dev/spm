import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDivComponent } from './simple-div.component';

describe('SimpleDivComponent', () => {
  let component: SimpleDivComponent;
  let fixture: ComponentFixture<SimpleDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
