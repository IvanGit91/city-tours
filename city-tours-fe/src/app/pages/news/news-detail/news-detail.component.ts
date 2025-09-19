import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {News} from 'src/app/model/News';
import {FileService} from 'src/app/shared/services/file/file.service';
import {NewsService} from '../../../shared/services/model/news.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {
  singleNews = new News();
  parameterValue: number;
  currentLang: string;
  localImage = "";

  constructor(private _newsService: NewsService,
              private routeActive: ActivatedRoute,
              private _fileService: FileService,
              private translateSrv: TranslateService) {

    this.currentLang = this.translateSrv.currentLang;
  }

  ngOnInit(): void {
    this.routeActive.params.subscribe(parameter => {
      this.parameterValue = parameter.id
    });
    /*     this._newsService.getNews(this.parameterValue).subscribe((resp) => this.singleNews = resp, (r) => console.log(r));
     */
    this._newsService.getNews(this.parameterValue).subscribe(
      (resp) => {

        this.singleNews = resp;


        const result = this.loadResource(this.singleNews);
        return new Promise((res, rej) => {
          res(result)
        })
      }
    )

  }

  changeImage(event) {
    const setLocalImage = (localImage: string) => {
      this.localImage = localImage;
    };
    const file = event.target.files[0];

    const readFile = new FileReader();
    readFile.onload = function (eventFileReader) {
      setLocalImage(eventFileReader.target['result'].toString());
    };
    readFile.readAsDataURL(file);


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

}
