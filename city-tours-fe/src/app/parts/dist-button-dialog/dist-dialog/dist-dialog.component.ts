import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dist-dialog',
  templateUrl: './dist-dialog.component.html',
  styleUrls: ['./dist-dialog.component.css']
})
export class DistDialogComponent implements OnInit {
  constructor(private _dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: { title: string, body: string, params: string }) {
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this._dialog.closeAll();
  }
}
