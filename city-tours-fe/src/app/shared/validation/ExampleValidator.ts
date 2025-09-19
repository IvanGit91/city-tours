import {Injectable} from "@angular/core";
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ExampleValidator {
  initialPsw: string = null;

  constructor() {

  }

  validate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = true;
      return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }
}
