import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompareToolDetailsComponent } from './compare-tool-details.component';

describe('CompareToolDetailsComponent', () => {
  let component: CompareToolDetailsComponent;
  let fixture: ComponentFixture<CompareToolDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareToolDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareToolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
