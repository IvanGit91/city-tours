import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {DistUtils} from "../../shared/util/DistUtils";
import {Location} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Poi} from "../../model/poi/Poi";
import {PoiService} from "../../shared/services/model/poi.service";
import {DistTel} from "../../model/common/DistTel";
import {UserService} from "../../shared/services/model/user.service";
import {Role} from "../../enum/Role";

@Component({
  selector: 'app-poi-home',
  templateUrl: './poi-home.component.html',
  styleUrls: ['./poi-home.component.css']
})
export class PoiHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSourceFilter: MatTableDataSource<Poi>;
  // Table with filter
  initialDisplayedColumnsFilter: string[];
  displayedColumnsFilter: string[];
  repeatedColumnsFilter: string[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private querySub: Subscription;

  constructor(private _service: PoiService,
              private route: ActivatedRoute,
              private _user_service: UserService,
              private location: Location) {
    const fixedColumn = ['denomination', 'address', 'phone', 'webSite', 'description', 'time', 'email', 'approvalDate', 'redactor'];
    if (this.user.role === this.role.Administrator) {
      this.displayedColumnsFilter = ['id', ...fixedColumn, 'operation'];
      this.repeatedColumnsFilter = ['id', ...fixedColumn];
    } else {
      this.displayedColumnsFilter = [...fixedColumn, 'operation'];
      this.repeatedColumnsFilter = fixedColumn;
    }
    this.initialDisplayedColumnsFilter = this.displayedColumnsFilter;
  }

  get utils() {
    return DistUtils;
  }

  get role() {
    return Role;
  }

  get user() {
    return this._user_service.currentUserValue;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFilter.filterPredicate = (data: Poi, filter: string) => {
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

  // Custom filter that uses the header name to filter without type distinction
  applyFilterSingleGeneric(event: Event, hName: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFilter.filterPredicate = (data: Poi, filter: string) => {
      let defFilter;
      if (data[hName] !== undefined && data[hName] !== null) {
        defFilter = this.getFilter(data, hName);
        return defFilter.trim().toLowerCase().includes(filter);
      }
      return null;
    };
    this.dataSourceFilter.filter = filterValue.trim().toLowerCase();
  }

  getFilter(data: Poi, hName: string) {
    let defFilter;
    if (hName === 'phone') {
      defFilter = this.utils.phone.concatenate(data[hName] as any as DistTel);
    } else if (hName === 'redactor') {
      defFilter = data[hName].name.toString();
    } else {
      defFilter = data[hName].toString();
    }
    return defFilter;
  }

  ngOnInit() {
    this.querySub = this.route.queryParams.subscribe(() => this.update());
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
    if (this._user_service.currentUserValue.role === Role.Redactor) {
      this._service.getAllRedactorOrderedByApprovalDate(this._user_service.currentUserValue.id).subscribe(value => this.dataSourceFilter.data = value);
    } else {
      this._service.getAllOrderedByApprovalDate().subscribe(value => this.dataSourceFilter.data = value);
    }
  }

  onRemove(id) {
    const dialogRef = DistUtils.openChooseDialog('MESSAGE.WARNING', 'MESSAGE.CONFIRM_DELETE');
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this._service.deleteLogical(id).subscribe(
            () => this.dataSourceFilter.data = this.dataSourceFilter.data.filter(e => e.id !== id),
            () => console.log('Error removing elem'),
            () => DistUtils.snackMessage(['MODELS.POI', 'OPERATIONS.REMOVED']));
        }
      }
    );
  }

  approve(id) {
    const dialogRef = DistUtils.openChooseDialog('MESSAGE.WARNING', 'MESSAGE.CONFIRM_APPROVE');
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this._service.setApprovalDate(id).subscribe(
            (resp) => {
              DistUtils.snackMessage(['MODELS.POI', 'OPERATIONS.APPROVED']);
              const index = this.dataSourceFilter.data.findIndex(f => f.id === resp.id);
              this.dataSourceFilter.data[index] = resp;
              this.dataSourceFilter.data = this.dataSourceFilter.data;
            }
          )
        }
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (window.innerWidth < 768 && window.innerWidth > 576) {
      if (!this.displayedColumnsFilter.includes("description"))
        this.displayedColumnsFilter.push("description");
      this.displayedColumnsFilter = this.displayedColumnsFilter.filter(f => f !== "phone" && f !== "webSite");
    } else if (window.innerWidth < 576) {
      this.displayedColumnsFilter = this.displayedColumnsFilter.filter(f => f !== "description");
    } else {
      this.displayedColumnsFilter = this.initialDisplayedColumnsFilter;
    }
  }

  onEvent(event) {
    event.stopPropagation();
  }
}
