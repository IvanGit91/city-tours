import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs";
import {DistrictService} from "../../../shared/services/model/district.service";
import {District} from "../../../model/District";
import {DistUtils} from "../../../shared/util/DistUtils";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-district-detail',
  templateUrl: './district-detail.component.html',
  styleUrls: ['./district-detail.component.css']
})
export class DistrictDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  districtId: number;
  district = new Subject<District>();
  currentLang: string;

  constructor(private _service: DistrictService,
              private route: ActivatedRoute,
              private translateSrv: TranslateService) {
    this.currentLang = this.translateSrv.currentLang;
  }

  get utils() {
    return DistUtils;
  }

  ngOnInit(): void {
    this.districtId = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this._service.getById(this.districtId).subscribe(p => {
      this.district.next(p);
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.district.unsubscribe();
  }

}
