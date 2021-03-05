import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyEarningsDetailsComponent } from './my-earnings-details.component';

describe('MyEarningsDetailsComponent', () => {
  let component: MyEarningsDetailsComponent;
  let fixture: ComponentFixture<MyEarningsDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEarningsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEarningsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
