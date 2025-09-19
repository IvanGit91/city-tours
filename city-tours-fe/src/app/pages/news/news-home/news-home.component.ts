import {Component, OnInit, ViewChild} from '@angular/core';
import {NewsService} from 'src/app/shared/services/model/news.service';
import {News} from "../../../model/News";
import {Subject} from "rxjs";
import {OwlOptions} from 'ngx-owl-carousel-o';
import {FileService} from 'src/app/shared/services/file/file.service';
import {SwiperComponent} from "swiper/types/shared";
import SwiperCore, {
  A11y,
  Autoplay,
  Controller,
  Navigation,
  Pagination,
  Scrollbar,
  Thumbs,
  Virtual,
  Zoom
} from "swiper/core";

SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);

@Component({
  selector: 'app-news-home',
  templateUrl: './news-home.component.html',
  styleUrls: ['./news-home.component.css']
})
export class NewsHomeComponent implements OnInit {
  @ViewChild("swiperRef", {static: false}) swiperRef?: SwiperComponent;
  fileType: string;
  news = new Subject<News[]>();
  publication: Date;

  monthNames = ["", "GEN", "FEB", "MAR", "APR", "MAG", "GIU",
    "LUG", "AGO", "SET", "OTT", "NOV", "DIC"
  ];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    items: 3,
    dots: true,
    autoplay: true,
    autoplaySpeed: 1000,
    navSpeed: 700,
    navText: ['', ''],
    /*     responsive: {
          0: {
            items: 1
          },
          400: {
            items: 2
          },
          740: {
            items: 3
          },
          940: {
            items: 4
          }
        }, */
    nav: true
  };
  scrollbar: any = true;
  indexNumber = 1;
  slides = Array.from({length: 5}).map((el, index) => `Slide ${index + 1}`);
  virtualSlides = Array.from({length: 600}).map(
    (el, index) => `Slide ${index + 1}`
  );
  navigation = true;
  autoplay = {
    delay: 2500,
    disableOnInteraction: false
  };
  pagination = false;
  breakpoints = {
    0: {slidesPerView: 1, spaceBetween: 60},
    768: {slidesPerView: 3, spaceBetween: 40},
    1024: {slidesPerView: 4, spaceBetween: 50}
  };

  constructor(private _newsService: NewsService, private _fileService: FileService) {
  }

  ngOnInit() {
    this._newsService.getAllNewsByApprovalDate().subscribe(
      (resp) => {
        for (let i = 0; i < resp.length; i++) {
          if (resp[i].pathImage == '') {
            resp[i].pathImage = "/assets/img/news_home_1.jpg"
          }
        }

        let promises = resp.map(async (element) => {
          const result = await this.loadResource(element);
          return new Promise((res, rej) => {
            res(result)
          })
        });

        Promise.all(promises)
          .then((results) => {
            this.news.next(resp);
          }).catch((e) => console.log("ERROR: ", e));
      }
    )
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

  onSlideChange(swiper: any) {
    // Solve infinite loop bug
    if (swiper !== undefined && swiper.isEnd) {
      setTimeout(() => {
        if (!swiper.destroyed) {
          swiper.slideTo(0);
        }
      }, 2000);
    }
  }

}
