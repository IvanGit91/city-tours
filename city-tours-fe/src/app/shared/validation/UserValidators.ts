import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {Observable, of, timer} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {UserService} from "../services/model/user.service";

export const URL = 'https://jsonplaceholder.typicode.com';

@Injectable({
  providedIn: 'root'
})
export class UserValidators {
  initialEmail: string = null;
  private time: number = 500;

  constructor(private _userService: UserService) {

  }

  userValidatorTimer(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      // If the user is the same as the initial one, I can modify it
      if (this.initialEmail === control.value)
        return of(null);
      return timer(this.time)
        .pipe(
          switchMap(() => this._userService.check(control.value))
        )
        .pipe(
          map((present) => {
            return (present) ? {'userNameExists': true} : null
          })
        )
    }
  };

  userValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._userService.check(control.value).pipe(
        map((present) => {
          return (present) ? {'userNameExists': true} : null
        })
      )
    }
  };
}
