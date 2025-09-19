import {Component, OnInit} from '@angular/core';
import {SearchService} from "../../shared/services/model/search.service";
import {DistUtils} from "../../shared/util/DistUtils";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {UtilityService} from "../../shared/services/model/utility.service";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit {
  searchForm = this.fb.group({
    searchValue: [null]
  });

  constructor(public fb: FormBuilder,
              private _search_service: SearchService,
              private router: Router,
              private _u_service: UtilityService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
  }

  ngOnInit(): void {
  }

  search(): void {
    if (this.searchForm.value.searchValue === null || this.searchForm.value.searchValue === "") {
      DistUtils.snackMessage("Insert a search value");
    } else {
      this._search_service.search(this.searchForm.value.searchValue).subscribe(v => {
        if (v === null || v.length === 0) {
          DistUtils.snackMessage("Search didn't produce any results");
        } else {
          this._u_service.overlayRef.detach();
          this.router.navigate(['/search']);
        }
      });
    }
  }
}
