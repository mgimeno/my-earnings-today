import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompareToolComponent } from './compare-tool.component';

describe('CompareToolComponent', () => {
  let component: CompareToolComponent;
  let fixture: ComponentFixture<CompareToolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
