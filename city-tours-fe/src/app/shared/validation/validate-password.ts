import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export class ValidatePassword {

  static MatchPassword(abstractControl: AbstractControl) {
    const password = abstractControl.get('password').value;
    const confirmPassword = abstractControl.get('confirmPassword').value;
    if (password !== confirmPassword) {
      abstractControl.get('confirmPassword').setErrors({
        MatchPassword: true
      });
    } else {
      return null;
    }
  }

  static MustMatch(oldPswControlName: string, controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const oldPswControl = formGroup.controls[oldPswControlName];
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      if (oldPswControl.value === control.value) {
        control.setErrors({sameOldPsw: true});
      }
      // set error on matchingControl if validation fails
      else if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

}
