import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {Observable, timer} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {UserService} from "../services/model/user.service";

export const URL = 'https://jsonplaceholder.typicode.com';

@Injectable({
  providedIn: 'root'
})
export class OldPswValidator {
  private time: number = 1000;

  constructor(private _userService: UserService) {
  }

  pswValidatorTimer(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return timer(this.time)
        .pipe(
          switchMap(() => this._userService.checkPsw(control.value))
        )
        .pipe(
          map((match) => {
            return (!match) ? {'oldPswNotMatch': true} : null
          })
        )
    }
  };

}
