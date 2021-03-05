import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserSelectionValidationDialogComponent } from './user-selection-validation-dialog.component';

describe('UserSelectionValidationDialogComponent', () => {
  let component: UserSelectionValidationDialogComponent;
  let fixture: ComponentFixture<UserSelectionValidationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSelectionValidationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelectionValidationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
