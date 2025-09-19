import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DistDialogComponent} from "./dist-dialog/dist-dialog.component";

@Component({
  selector: 'app-dist-button-dialog',
  templateUrl: './dist-button-dialog.component.html',
  styleUrls: ['./dist-button-dialog.component.css']
})
export class DistButtonDialogComponent implements OnInit {
  @Input() m_title: string;
  @Input() m_body: string;

  constructor(private _dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openDialog(title, body) {
    this._dialog.open(DistDialogComponent, {
      data: {title: title, body: body},
    });
  }
}
