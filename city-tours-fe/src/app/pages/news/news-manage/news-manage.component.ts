import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {ModalComponent} from 'src/app/parts/delete-dialog/delete-dialog';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {News} from 'src/app/model/News';
import {NewsService} from '../../../shared/services/model/news.service';
import {MatPaginator} from '@angular/material/paginator';
import {Location} from "@angular/common";
import {DistUtils} from 'src/app/shared/util/DistUtils';
import {UserService} from 'src/app/shared/services/model/user.service';
import {Role} from "../../../enum/Role";


@Component({
  selector: 'app-news-manage',
  templateUrl: './news-manage.component.html',
  styleUrls: ['./news-manage.component.css']
})
export class NewsManageComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSourceFilter: MatTableDataSource<News>;
  idNews: number = 1;
  news: News;
  displayedColumnsFilter: string[] = ['id', 'title', 'publicationDate', 'approvalDate', 'author', 'redactor', 'operation'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /**
   * Pre-defined columns list for user table
   */
  columnNames = [
    {
      id: 'id',
      value: 'No.',
    },
    {
      id: 'title',
      value: 'title',
    },
    {
      id: 'publicationDate',
      value: 'publicationDate',
    },
    {
      id: 'author',
      value: 'author',
    },
    {
      id: 'modify',
      value: 'modify',
    }];
  private querySub: Subscription;

  constructor(private _newsService: NewsService, public modal: MatDialog,
              private location: Location, private route: ActivatedRoute,
              private _userService: UserService) {

  }

  get role() {
    return Role;
  }

  get user() {
    return this._userService.currentUserValue;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFilter.filterPredicate = (data: News, filter: string) => {
      let defFilter = null;
      let defValue = false;
      for (const hName of this.displayedColumnsFilter) {
        if (data[hName] !== undefined && data[hName] !== null) {
          defFilter = this.getFilter(data, hName);
          if (defFilter.trim().toLowerCase().includes(filter)) {
            defValue = true;
            break;
          }
        }
      }
      return defValue !== null ? defValue : null;
    };
    this.dataSourceFilter.filter = filterValue.trim().toLowerCase();
  }

  applyFilterSingleGeneric(event: Event, hName: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFilter.filterPredicate = (data: News, filter: string) => {
      let defFilter;
      if (data[hName] !== undefined && data[hName] !== null) {
        defFilter = this.getFilter(data, hName);
        return defFilter.trim().toLowerCase().includes(filter);
      }
      return null;
    };
    this.dataSourceFilter.filter = filterValue.trim().toLowerCase();
  }

  getFilter(data: News, hName: string) {
    let defFilter;
    if (hName === 'redactor') {
      defFilter = data[hName].name.toString();
    } else {
      defFilter = data[hName].toString();
    }
    return defFilter;
  }

  ngOnInit(): void {
    this.querySub = this.route.queryParams.subscribe(() => this.update());
  }

  openModal(newsId: number): void {
    let modalRef = this.modal.open(ModalComponent, {
      height: '200px',
      width: '600px',
      data: {id: newsId}
    });
  }

  ngOnDestroy(): void {
    this.querySub.unsubscribe();
  }

  ngAfterViewInit(): void {
    DistUtils.messageFromState(this.location.getState());
    this.dataSourceFilter.paginator = this.paginator;
    this.dataSourceFilter.sort = this.sort;
  }

  update() {
    this.dataSourceFilter = new MatTableDataSource();
    if (this.user.role === "ROLE_ADMINISTRATOR") {
      this._newsService.getAllNews().subscribe(value => {
        this.dataSourceFilter.data = value;
      });
    } else {
      this._newsService.getAllByRedactorId(this.user.id).subscribe(value => {
        this.dataSourceFilter.data = value;
      });
    }
  }

  onRemove(id) {
    const dialogRef = DistUtils.openChooseDialog('MESSAGE.WARNING', 'MESSAGE.CONFIRM_DELETE');
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this._newsService.deleteLogical(id).subscribe(
            () => this.dataSourceFilter.data = this.dataSourceFilter.data.filter(e => e.id !== id),
            () => console.log('Error removing elem'),
            () => DistUtils.snackMessage('MESSAGE.NEWS_DELETED'));
        }
      }
    );
  }

  approve(id) {
    const dialogRef = DistUtils.openChooseDialog('MESSAGE.WARNING', 'MESSAGE.CONFIRM_APPROVE');
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this._newsService.setApprovalDate(id, this.news).toPromise().then(
            (resp) => {
              DistUtils.snackMessage('MESSAGE.NEWS_APPROVED');
              this._newsService.getAllNews().subscribe(
                (resp) => {
                  this.dataSourceFilter.data = resp;
                }
              )
              /* const index = this.dataSourceFilter.data.findIndex(f => f.id === resp.id);

              this.dataSourceFilter.data[index] = resp;
              this.dataSourceFilter.data = this.dataSourceFilter.data; */

            }
          )
        }
      }
    );
  }

  onEvent(event) {
    event.stopPropagation();
  }
}

export interface Element {
  position: number,
  name: string,
  weight: number,
  symbol: string
}
