import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTaskDetailComponent } from './manager-task-detail.component';

describe('ManagerTaskDetailComponent', () => {
  let component: ManagerTaskDetailComponent;
  let fixture: ComponentFixture<ManagerTaskDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerTaskDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
