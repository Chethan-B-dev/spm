import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerProjectDetailComponent } from './manager-project-detail.component';

describe('ManagerProjectDetailComponent', () => {
  let component: ManagerProjectDetailComponent;
  let fixture: ComponentFixture<ManagerProjectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerProjectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
