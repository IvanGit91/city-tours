import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dist-choose-dialog',
  templateUrl: './dist-choose-dialog.component.html',
  styleUrls: ['./dist-choose-dialog.component.css']
})
export class DistChooseDialogComponent implements OnInit {
  constructor(private _dialog: MatDialog,
              private matDialogRef: MatDialogRef<DistChooseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { title: string, body: string }) {
  }

  ngOnInit(): void {

  }

  confirm() {
    this.matDialogRef.close(true);
  }

  close() {
    this.matDialogRef.close(false);
  }
}
