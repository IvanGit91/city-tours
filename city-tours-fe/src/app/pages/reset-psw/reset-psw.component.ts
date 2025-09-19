import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from 'src/app/shared/services/model/user.service';
import {ValidatePassword} from 'src/app/shared/validation/validate-password';
import {JwtResponse} from 'src/app/model/common/JwtResponse';
import {Router} from '@angular/router';
import {OldPswValidator} from "../../shared/validation/OldPswValidator";

export class Psw {
  tempPassword: string;
  newPassword: string;

  constructor(tempPassword, newPassword) {
    this.tempPassword = tempPassword;
    this.newPassword = newPassword;
  }
}

@Component({
  selector: 'app-reset-psw',
  templateUrl: './reset-psw.component.html',
  styleUrls: ['./reset-psw.component.css']
})
export class ResetPswComponent implements OnInit {

  currentUser: JwtResponse;
  isVerify: boolean;
  psw: FormGroup = this.fb.group({
    passwordTemp: ['', [Validators.required], [this.oldPwValidator.pswValidatorTimer()]],
    newPassword: ['', [Validators.required,
      Validators.pattern(('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validator: ValidatePassword.MustMatch('passwordTemp', 'newPassword', 'confirmPassword')
  });

  constructor(private _userService: UserService,
              public fb: FormBuilder,
              private router: Router,
              private oldPwValidator: OldPswValidator) {
  }

  get pswForm() {
    return this.psw.controls as any;
  }

  ngOnInit(): void {
    this.currentUser = this._userService.currentUserValue;
    this.isVerify = this.currentUser.verify;
  }

  onSubmit() {
    this._userService.activate(this.currentUser.id, this.pswForm.passwordTemp.value, this.pswForm.newPassword.value).subscribe(
      (resp) => {
        this._userService.logout();
        localStorage.removeItem("currentUser");
        this.currentUser = null;
        if (!this.isVerify) {
          this.router.navigate(['/home'], {state: {msg: 'MESSAGE.USER_VERIFY'}});
        } else {
          this.router.navigate(['/home'], {state: {msg: 'MESSAGE.PSW_UPDATE'}});
        }
      },
      (err) => {
        if (!this.isVerify) {
          this.router.navigate(['/home'], {state: {msg: 'MESSAGE.USER_NOT_VERIFY'}});
        } else {
          this.router.navigate(['/home'], {state: {msg: 'MESSAGE.PSW_NOT_UPDATE'}});
        }
      }
    )
  }

  onStrengthChanged(strength: number) {
  }
}
