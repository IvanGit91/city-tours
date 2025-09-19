import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {PoiService} from "../../../shared/services/model/poi.service";
import {ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs";
import {Poi} from "../../../model/poi/Poi";
import {DistUtils} from "../../../shared/util/DistUtils";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-poi-detail',
  templateUrl: './poi-detail.component.html',
  styleUrls: ['./poi-detail.component.css']
})
export class PoiDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  poiId: number;
  poi = new Subject<Poi>();
  currentLang: string;

  constructor(private _service: PoiService,
              private route: ActivatedRoute,
              private translateSrv: TranslateService) {
    this.currentLang = this.translateSrv.currentLang;
  }

  get utils() {
    return DistUtils;
  }

  ngOnInit(): void {
    this.poiId = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this._service.getById(this.poiId).subscribe(p => {
      this.poi.next(p);
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.poi.unsubscribe();
  }

}
