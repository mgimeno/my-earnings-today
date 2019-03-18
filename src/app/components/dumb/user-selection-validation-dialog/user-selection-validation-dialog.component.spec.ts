import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectionValidationDialogComponent } from './user-selection-validation-dialog.component';

describe('UserSelectionValidationDialogComponent', () => {
  let component: UserSelectionValidationDialogComponent;
  let fixture: ComponentFixture<UserSelectionValidationDialogComponent>;

  beforeEach(async(() => {
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
