import {MatSnackBar} from '@angular/material/snack-bar';
import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DistMessagesComponent} from "../../parts/dist-messages/dist-messages.component";
import {DistDialogComponent} from "../../parts/dist-button-dialog/dist-dialog/dist-dialog.component";
import {TranslateService} from "@ngx-translate/core";
import {JwtResponse} from "../../model/common/JwtResponse";
import {DistChooseDialogComponent} from "../../parts/dist-choose-dialog/dist-choose-dialog.component";
import {DistTel} from "../../model/common/DistTel";
import {TypizedFile} from "../../model/common/TypizedFile";
import {PoiDetailDialogComponent} from "../../parts/poi-detail-dialog/poi-detail-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DistUtils {
  public static snackBar: MatSnackBar;
  public static dialog: MatDialog;
  public static translateSrv: TranslateService;

  constructor(private _snackBar: MatSnackBar, private _dialog: MatDialog, private _translateSrv: TranslateService) {
    DistUtils.snackBar = _snackBar;
    DistUtils.dialog = _dialog;
    DistUtils.translateSrv = _translateSrv;
  }

  public static get user() {
    return JwtResponse;
  }

  public static get phone() {
    return DistTel;
  }

  public static get file() {
    return TypizedFile;
  }

  public static messageFromState(stateUnk, duration?) {
    const state = stateUnk as any;
    if (state.msg !== undefined) {
      if (state.dialog !== undefined && state.dialog) {
        this.openDialog(state.title, state.msg);
      } else {
        this.snackMessage(state.msg, duration);
      }
    }
  }

  public static snackMessage(msg: any, duration?) {
    let config: any;
    if (duration === undefined) {
      duration = 3000;
    }
    config = {data: msg, duration: duration};
    this.snackBar.openFromComponent(DistMessagesComponent, config);
  }

  public static openDialog(title, body, params?) {
    this.dialog.open(DistDialogComponent, {
      data: {title: title, body: body, params: params},
    });
  }

  public static openChooseDialog(title, body): MatDialogRef<DistChooseDialogComponent> {
    return this.dialog.open(DistChooseDialogComponent, {
      data: {title: title, body: body},
    });
  }

  public static openPoiDialog(data): MatDialogRef<PoiDetailDialogComponent> {
    return this.dialog.open(PoiDetailDialogComponent, {
      data,
    });
  }

  public static nameFromPath(path: string) {
    const imgSplit = path.split("/");
    return imgSplit[imgSplit.length - 1];
  }

  public static toDate(date) {
    return date !== null ? new Date(Date.UTC(date[0], date[1] - 1, date[2])) : null;
  }
}
