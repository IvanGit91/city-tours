import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UserService} from 'src/app/shared/services/model/user.service';
import {User} from 'src/app/model/User';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DistUtils} from 'src/app/shared/util/DistUtils';
import {JwtResponse} from 'src/app/model/common/JwtResponse';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSourceFilter: MatTableDataSource<User>;
  currentUser: JwtResponse;
  displayedColumnsFilter: string[] = ['id', 'name', 'phone', 'address', 'email', 'role', 'operation'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private querySub: Subscription;

  constructor(private _userService: UserService,
              private _route: ActivatedRoute,
              private _location: Location) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFilter.filterPredicate = (data: User, filter: string) => {
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
    this.dataSourceFilter.filterPredicate = (data: User, filter: string) => {
      let defFilter;
      if (data[hName] !== undefined && data[hName] !== null) {
        defFilter = this.getFilter(data, hName);
        return defFilter.trim().toLowerCase().includes(filter);
      }
      return null;
    };
    this.dataSourceFilter.filter = filterValue.trim().toLowerCase();
  }

  getFilter(data: User, hName: string) {
    let defFilter;
    if (hName === 'role') {
      defFilter = data[hName].name.toString();
    } else {
      defFilter = data[hName].toString();
    }
    return defFilter;
  }

  ngOnInit(): void {
    this.querySub = this._route.queryParams.subscribe(() => this.update());
  }

  ngOnDestroy(): void {
    this.querySub.unsubscribe();
  }

  ngAfterViewInit(): void {
    DistUtils.messageFromState(this._location.getState());
    this.dataSourceFilter.paginator = this.paginator;
    this.dataSourceFilter.sort = this.sort;
  }

  update() {
    this.dataSourceFilter = new MatTableDataSource();
    this.currentUser = this._userService.currentUserValue;
    this._userService.getAll().subscribe(
      (value) => {
        this.dataSourceFilter.data = value.filter(d => d.id !== this.currentUser.id);
      }
    );
  }

  onRemove(id) {
    const dialogRef = DistUtils.openChooseDialog('MESSAGE.WARNING', 'MESSAGE.CONFIRM_DELETE');
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this._userService.deleteLogical(id).subscribe(
            () => this.dataSourceFilter.data = this.dataSourceFilter.data.filter(e => e.id !== id),
            () => console.log('Error removing elem'),
            () => DistUtils.snackMessage('MESSAGE.USER_DELETED'));
        }
      }
    );
  }

  onEvent(event) {
    event.stopPropagation();
  }
}
