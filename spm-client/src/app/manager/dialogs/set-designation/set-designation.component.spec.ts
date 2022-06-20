import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDesignationComponent } from './set-designation.component';

describe('SetDesignationComponent', () => {
  let component: SetDesignationComponent;
  let fixture: ComponentFixture<SetDesignationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetDesignationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
