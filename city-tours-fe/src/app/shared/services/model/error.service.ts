import {Injectable} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {DistUtils} from "../../util/DistUtils";
import {throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  errorHandler(error: HttpErrorResponse) {
    DistUtils.openDialog(error.statusText + " - " + error.status, error.message);
    return throwError(error || "server error.");
  }

}
