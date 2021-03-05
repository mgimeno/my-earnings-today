import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyEarningsComponent } from './my-earnings.component';

describe('MyEarningsComponent', () => {
  let component: MyEarningsComponent;
  let fixture: ComponentFixture<MyEarningsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyEarningsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
