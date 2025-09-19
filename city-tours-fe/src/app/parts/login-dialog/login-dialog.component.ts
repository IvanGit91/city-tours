import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/model/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {UserIdleService} from "angular-user-idle";
import {DistUtils} from "../../shared/util/DistUtils";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('500ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class LoginDialogComponent implements OnInit {
  loginLabel: string;
  mailToLabel: string;
  mailToLabelError: string;
  isInvalid: boolean;
  isLogout: boolean;
  submitted = false;
  hide = true;
  returnUrl = '/';
  email = new FormControl('', [Validators.email]);
  login = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberme: [false]
  });
  private fadeTimeout: number = 5000;

  constructor(private _dialog: MatDialog,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private translateSrv: TranslateService,
              private userIdle: UserIdleService,
              private dialogRef: MatDialogRef<LoginDialogComponent>) {
    dialogRef.disableClose = true;

    const tr$ = this.translateSrv.getTranslation(this.translateSrv.currentLang).subscribe((t) => {
      this.loginLabel = t.LABELS.LOGGEDAS;
      this.mailToLabel = t.MESSAGE.MAIL_TO;
      this.mailToLabelError = t.MESSAGE.MAIL_TO_ERROR;
    }, () => {
    }, () => {
      tr$.unsubscribe();
    });
  }

  get f(): any {
    return this.login.controls;
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.isLogout = params.has('logout');
    this.returnUrl = params.get('returnUrl');
  }

  closeDialog() {
    this._dialog.closeAll();
  }

  onSubmit() {
    this.submitted = true;
    this.userService.login(this.login).subscribe(
      user => {
        if (user) {
          const msg = this.loginLabel + this.login.controls.username.value;
          this.closeDialog();

          //Start watching for user inactivity.
          this.userIdle.startWatching();

          // Start watching when user idle is starting.
          this.userIdle.onTimerStart().subscribe(count => console.log(count));

          // Start watch when time is up.
          this.userIdle.onTimeout().subscribe(() => {
            console.log('Time is up!');
            this.logout();
          });
          DistUtils.snackMessage(msg);
          localStorage.setItem("currentUser", JSON.stringify({
              id: this.userService.currentUserValue.id,
              token: this.userService.currentUserValue.token,
              type: this.userService.currentUserValue.type,
              account: this.userService.currentUserValue.account,
              name: this.userService.currentUserValue.name,
              role: this.userService.currentUserValue.role,
              verify: this.userService.currentUserValue.verify
            })
          );
          this.router.navigate(['/profile']);
        } else {
          this.isLogout = false;
          this.isInvalid = true;
          setTimeout(() => {
            this.isInvalid = false;
          }, this.fadeTimeout);
        }
      }
    );
  }

  logout() {
    this.userService.logout();
    this.userIdle.stopWatching();
    this.reloadCurrentRoute();
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    if (currentUrl === '/home') {
      DistUtils.openDialog('LOGGEDOUT', 'LOGGEDOUTMSG');
    } else {
      this.router.navigate(['/home'], {state: {dialog: true, title: 'LOGGEDOUT', msg: 'LOGGEDOUTMSG'}});
    }
  }

  sendMail() {
    this.userService.reset(this.email.value).subscribe(
      (resp) => {
        DistUtils.snackMessage(this.mailToLabel + ": " + this.email.value);
      },
      (err) => {
        DistUtils.snackMessage(this.mailToLabelError);
      }
    );

    //DistUtils.snackMessage(['MESSAGE.MAIL_TO', this.email.value]);
  }

  fillLoginFields(u, p) {
    this.login.controls.username.setValue(u);
    this.login.controls.password.setValue(p);
    this.onSubmit();
  }

}
