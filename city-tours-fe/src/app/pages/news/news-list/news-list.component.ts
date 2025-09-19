import {animate, style, transition, trigger} from '@angular/animations';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {News} from 'src/app/model/News';
import {FileService} from 'src/app/shared/services/file/file.service';
import {DistUtils} from 'src/app/shared/util/DistUtils';
import {NewsService} from '../../../shared/services/model/news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({opacity: 0}),
        animate('800ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('600ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class NewsListComponent implements OnInit {
  news = new Subject<News[]>();
  paginating: boolean = false;
  pageSize = 8;
  currentPage = 0;
  totalSize = 0;
  monthNames = ["", "GEN", "FEB", "MAR", "APR", "MAG", "GIU",
    "LUG", "AGO", "SET", "OTT", "NOV", "DIC"
  ];

  constructor(private _newsService: NewsService,
              private _fileService: FileService,
              private ref: ChangeDetectorRef) {
  }

  get utils() {
    return DistUtils;
  }

  ngOnInit() {
    /*   this._newsService.getAllNews().subscribe(
        (resp) => {

          for (var i = 0; i<resp.length; i++){
            if (resp[i].pathImage == ''){
              resp[i].pathImage = "/assets/img/news_home_1.jpg"
            }
          }

        let promises = resp.map(async (element) => {
          const result = await this.loadResource(element);
          return new Promise((res, rej) => {res(result)})
        });

        Promise.all(promises)
          .then((results) => {
            this.news.next(resp);
          }).catch((e) => console.log("ERROR: ", e));

          this.handlePage({pageIndex : this.currentPage, pageSize : this.pageSize});
      }
    ) */

    this.handlePage({pageIndex: this.currentPage, pageSize: this.pageSize});
  }

  loadResource = (element) => {
    return new Promise((resolve, rej) => {
      if (element.pathImage) {
        this._fileService.getResourceUri(element.pathImage).subscribe(
          (r) => {
            element.pathImage = "data:image/" + r.contentType + ";base64," + r.file;
            resolve(element);
          },
          (err) => {
            element.pathImage = "";
            resolve("");
          }
        )
      }
    })
  };

  handlePage(e: any) {
    this.paginating = false;
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this._newsService.getAllNewsPageable(this.currentPage, this.pageSize).subscribe((p) => {
      this.ref.detectChanges();
      this.paginating = true;
      this.ref.detectChanges();
      this.news.next(p.content);
      this.totalSize = p.totalElements;
    });

    /*   this._newsService.getAllNews().subscribe((p) => {
        this.news.next(p);
       }); */

  }

}
