import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dist-messages',
  templateUrl: './dist-messages.component.html',
  styleUrls: ['./dist-messages.component.css'],
})
export class DistMessagesComponent implements OnInit {

  isArray: boolean = false;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              private _snackBar: MatSnackBar) {
    this.isArray = data instanceof Array;
  }

  ngOnInit(): void {
  }

  closePopup() {
    this._snackBar.dismiss();
  }

}
