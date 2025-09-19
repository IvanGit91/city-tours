import {Component, OnInit} from '@angular/core';
import {SearchService} from "../../shared/services/model/search.service";
import {Overlay} from "@angular/cdk/overlay";
import {Search} from "../../model/Search";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  elemType: string[] = ['news', 'district', 'poi'];
  searchNews: BehaviorSubject<Search[]> = new BehaviorSubject<Search[]>([]);
  countNews: number = 0;
  searchDistricts: BehaviorSubject<Search[]> = new BehaviorSubject<Search[]>([]);
  countDistricts: number = 0;
  searchPois: BehaviorSubject<Search[]> = new BehaviorSubject<Search[]>([]);
  countPois: number = 0;

  constructor(private _search_service: SearchService,
              public overlay: Overlay) {
  }

  ngOnInit(): void {
    this._search_service.values.subscribe(v => {
      let elems = v.filter(e => e.type === this.elemType[0]);
      this.countNews = elems.length;
      this.searchNews.next(elems);
      elems = v.filter(e => e.type === this.elemType[1]);
      this.countDistricts = elems.length;
      this.searchDistricts.next(elems);
      elems = v.filter(e => e.type === this.elemType[2]);
      this.countPois = elems.length;
      this.searchPois.next(elems);
    })
  }

}
