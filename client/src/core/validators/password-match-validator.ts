import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchPasswordValidator(passwordControlName: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;
    const password = control.parent.get(passwordControlName)?.value;
    if (control.value !== password) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
