import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {UserService} from 'src/app/shared/services/model/user.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from 'src/app/model/User';
import {ROLE, RoleItem} from 'src/app/enum/Role';
import {DistUtils} from 'src/app/shared/util/DistUtils';
import {UserValidators} from "../../../shared/validation/UserValidators";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-user-op',
  templateUrl: './user-op.component.html',
  styleUrls: ['./user-op.component.css'],
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
export class UserOpComponent implements OnInit {
  isEdit = false;
  parameterValue: string;
  selectedValue: string;
  singleUser: User;
  roleList: BehaviorSubject<RoleItem[]> = new BehaviorSubject<RoleItem[]>(ROLE);
  user = this.fb.group({
    id: [null,],
    email: ['', [Validators.required, Validators.email], [this.userValid.userValidatorTimer()]],
    password: ['',],
    name: ['', [Validators.required]],
    phone: ['',],
    address: ['', [Validators.required]],
    active: [true,],
    role: ['', [Validators.required]],
    verify: [false,]
  });

  constructor(private _userService: UserService,
              public fb: FormBuilder,
              private _route: ActivatedRoute,
              private _router: Router,
              private userValid: UserValidators) {
  }

  get userForm() {
    return this.user.controls as any;
  }

  initFormUser(user: User) {
    this.userValid.initialEmail = user.email;
    this.userForm.id.setValue(user.id);
    this.userForm.email.setValue(user.email);
    this.userForm.password.setValue(user.password);
    this.userForm.name.setValue(user.name);
    this.userForm.phone.setValue(user.phone);
    this.userForm.address.setValue(user.address);
    this.userForm.active.setValue(user.active);
    this.userForm.role.setValue(user.role);
    this.selectedValue = user.role.id + " - " + user.role.name;
  }

  ngOnInit(): void {
    let idUser = this._route.snapshot.params.id;
    if (idUser == -1) {
      this.isEdit = false;
    } else {
      this.isEdit = true;
    }
    if (this.isEdit) {
      this._route.params.subscribe(parameter => {
        this.parameterValue = parameter.id
      });
      this._userService.getOne(this.parameterValue).subscribe(resp => {
          this.singleUser = resp;
          this.initFormUser(this.singleUser);
        }
      )
    }
  }

  onSubmit() {
    if (!this.isEdit) {
      this._userService.signUp(this.user.value).subscribe(d => {
          this._router.navigate(['/user-management'], {state: {msg: 'MESSAGE.USER_ADDED'}});
        },
        () => {
          DistUtils.snackMessage("VALIDATION_MSG.USER_NOT_INSERT")
        })
    } else {
      this._userService.updateOne(this.user.value).subscribe(d => {
          this._router.navigate(['/user-management'], {state: {msg: 'MESSAGE.USER_MOD'}});
        },
        () => {
          DistUtils.snackMessage("VALIDATION_MSG.USER_NOT_EDIT");
        })
    }
  }

  compareFunction(o1: any, o2: any) {
    return o1 !== null && o2 !== null && o1 !== "" && o2 !== "" && o1 === o2;
  }
}
