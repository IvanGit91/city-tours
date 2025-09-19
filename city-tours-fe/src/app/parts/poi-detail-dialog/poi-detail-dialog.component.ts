import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {DistTel} from "../../model/common/DistTel";
import {DistUtils} from "../../shared/util/DistUtils";

@Component({
  selector: 'app-poi-detail-dialog',
  templateUrl: './poi-detail-dialog.component.html',
  styleUrls: ['./poi-detail-dialog.component.css']
})
export class PoiDetailDialogComponent implements OnInit {
  constructor(private _dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data:
              {
                id: number,
                denomination: string,
                description: string,
                address: string,
                webSite: string,
                phone: DistTel,
                email: string,
                logo: any,
                time: string,
                type: string
              }) {
  }

  get utils() {
    return DistUtils;
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this._dialog.closeAll();
  }
}
