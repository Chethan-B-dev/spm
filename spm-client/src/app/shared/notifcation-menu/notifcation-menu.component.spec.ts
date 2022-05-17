import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifcationMenuComponent } from './notifcation-menu.component';

describe('NotifcationMenuComponent', () => {
  let component: NotifcationMenuComponent;
  let fixture: ComponentFixture<NotifcationMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifcationMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifcationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
