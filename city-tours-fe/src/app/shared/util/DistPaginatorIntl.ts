import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class DistPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel;
  itemsPerPageLabel;
  lastPageLabel;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel;
  previousPageLabel;

  pagee;
  pageOf;

  constructor(private translateSrv: TranslateService) {
    const tr$ = this.translateSrv.getTranslation(this.translateSrv.currentLang).subscribe((t) => {
      this.firstPageLabel = t.TABLE.FIRST_PAGE;
      this.itemsPerPageLabel = t.TABLE.ITEMS_PER_PAGE;
      this.lastPageLabel = t.TABLE.LAST_PAGE;
      this.nextPageLabel = t.TABLE.NEXT_PAGE;
      this.previousPageLabel = t.TABLE.PREVIOUS_PAGE;
      this.pagee = t.TABLE.PAGE;
      this.pageOf = t.TABLE.PAGE_OF;
    }, () => {
    }, () => {
      tr$.unsubscribe();
    });
  }

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return this.pagee + ' 1 ' + this.pageOf + ' 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return this.pagee + ` ${page + 1} ` + this.pageOf + ` ${amountPages}`;
  }
}
