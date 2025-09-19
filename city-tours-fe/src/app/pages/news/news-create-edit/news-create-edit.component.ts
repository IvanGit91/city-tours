import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {News} from 'src/app/model/News';
import {FileService} from 'src/app/shared/services/file/file.service';
import {NewsService} from '../../../shared/services/model/news.service';
import {DateAdapter} from "@angular/material/core";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DistUtils} from "../../../shared/util/DistUtils";
import {DomSanitizer} from '@angular/platform-browser';
import {animate, style, transition, trigger} from '@angular/animations';
import {ImageCheck} from 'src/app/dto/ImageCheck';
import {JwtResponse} from 'src/app/model/common/JwtResponse';
import {IMAGE_MAX_HEIGHT, IMAGE_MAX_SIZE_KB, IMAGE_MAX_WIDTH} from "../../../shared/util/constant";


@Component({
  selector: 'app-news-create-edit',
  templateUrl: './news-create-edit.component.html',
  styleUrls: ['./news-create-edit.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('500ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class NewsCreateEditComponent implements OnInit {
  newsForm: FormGroup;
  isCreate: boolean;
  singleNews = new News();
  public parameterValue: number;

  imageName = null;
  imageBase64: any = null;
  imageError: boolean = false;
  imageCheck: ImageCheck = new ImageCheck(IMAGE_MAX_SIZE_KB, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT);
  imageSize: number;
  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = null;
  showImage: boolean = true;
  file: any = null;
  currentDate = new Date();
  currentUser: JwtResponse;
  localImage = "";
  private fadeTimeout: number = 5000;

  constructor(
    public domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private _routeActivated: ActivatedRoute,
    private _newsService: NewsService,
    private _router: Router,
    private _fileService: FileService,
    private _adapter: DateAdapter<any>) {

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    this.newsForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      descriptionExtended: [''],
      descriptionEng: [''],
      publicationDate: ['', [Validators.required, this.verifyDate()]],
      pathImage: ['./src/assets/img/news_home_1.jpg'],
      approvalDate: [null],
      author: ['', [Validators.required]]

    });

    if (this._routeActivated.snapshot.url.toString().includes('create')) {
      this.isCreate = true;
      this.showImage = false;
    } else {
      this.isCreate = false;
    }

    //this._adapter.setLocale('us');

  }

  get f(): any {
    return this.newsForm.controls;
  }

  ngOnInit() {

    if (!this.isCreate) {
      this._routeActivated.params.subscribe(parameter => {
        this.parameterValue = parameter.id
      });
      this._newsService.getNews(this.parameterValue).subscribe(resp => {
        this.singleNews = resp;
        if (this.singleNews.pathImage == '') {
          this.showImage = false;
        }
        //this.singleNews.publicationDate = this.singleNews.publicationDate[0] + '-' + (parseInt( this.singleNews.publicationDate[1]) <10? '0' + this.singleNews.publicationDate[1]:this.singleNews.publicationDate[1]) +  '-' + (parseInt( this.singleNews.publicationDate[2]) <10? '0' + this.singleNews.publicationDate[2]:this.singleNews.publicationDate[2]) + 'T00:00:00.000Z';
        this.initFormNews(this.singleNews);

        const result = this.loadResource(this.singleNews);
        return new Promise((res, rej) => {
          res(result)
        })

      });


    }

  }

  onSubmit() {
    if (this.isCreate) {
      const news = this.newsForm.value;
      // var offsetMs = this.newsForm.value.publicationDate.getTimezoneOffset() * 60000;
      // this.newsForm.value.publicationDate = new Date(this.newsForm.value.publicationDate.getTime() - offsetMs);
      this._newsService.createNews(news).toPromise().then(
        (resp) => {
          this.singleNews = resp;
          if (this.file != null) {
            this._newsService.setImage(this.singleNews.id, this.file).subscribe(
              (resp) => {
                /* localStorage.setItem("currentUser", JSON.stringify({
                  id: this.userService.currentUserValue.id})
                ); */
                this._router.navigate(['/news-management']);
              }
            )
          } else {
            this._router.navigate(['/news-management']);
          }
        }
      )

    } else if (!this.isCreate) {
      // var offsetMs = this.newsForm.value.publicationDate.getTimezoneOffset() * 60000;
      // this.newsForm.value.publicationDate = new Date(this.newsForm.value.publicationDate.getTime() - offsetMs);
      let news = this.newsForm.value;
      this._newsService.updateNews(this.parameterValue, news).toPromise().then(
        resp => {
          news = resp;
          if (this.file != '' && this.file != null) {
            this._newsService.setImage(this.singleNews.id, this.file).subscribe(
              (resp) => {
                this._router.navigate(['/news-management']);
              }
            )
          } else {
            this._router.navigate(['/news-management'])
          }
        });
    }
  }

  verifyDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < this.currentDate)) {
        return {'dateRange': true};
      }
      return null;
    };
  }

  initFormNews(news: News) {
    this.f.id.setValue(news.id);
    this.f.title.setValue(news.title);
    this.f.description.setValue(news.description);
    this.f.author.setValue(news.author);
    this.f.descriptionExtended.setValue(news.descriptionExtended);
    this.f.descriptionEng.setValue(news.descriptionEng);
    this.f.publicationDate.setValue(DistUtils.toDate(news.publicationDate));
    this.f.approvalDate.setValue(DistUtils.toDate(news.approvalDate));
    this.f.pathImage.setValue(news.pathImage);

    /*     if (news.path_image) {
          this.catalogueImage = this._commonSrv.getResourceUri(catalogue.pathImage);
          this.fc.file.setValue(catalogue.pathImage);
        } */
  }

  onDescriptionExtendedChange(data: string) {
    this.f.descriptionExtended.setValue(data);
  }

  onDescriptionEngChange(data: string) {
    this.f.descriptionEng.setValue(data);
  }

  changeDateEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  }

  /*
  uploadFileEvt(imgFile: any) {
      if (imgFile.target.files && imgFile.target.files[0]) {
        this.fileAttr = '';
        Array.from(imgFile.target.files).forEach((file: File) => {
          this.fileAttr += file.name + ' - ';
        });

        // HTML5 FileReader API
        let reader = new FileReader();
        reader.onload = (e: any) => {
          let image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            let imgBase64Path = e.target.result;
          };
        };
        reader.readAsDataURL(imgFile.target.files[0]);

        // Reset if duplicate image uploaded again
        this.fileInput.nativeElement.value = "";
      }
      else {
        this.fileAttr = 'Choose File';
      }
  }
  */

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {

      const file = imgFile.target.files[0];

      this.imageSize = file.size / 1024; // In KB
      this.imageName = file.name;

      this.file = imgFile.target.files[0];
      this.fileAttr = file.name;
      this.newsForm.patchValue({
        image: file
      });
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = "";

      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        this.localImage = e.target.result;
        this.showImage = true;
        image.src = e.target.result;
        image.onload = rs => {
          if (this.imageSize > this.imageCheck.maxSize || image.width > this.imageCheck.maxWidth || image.height > this.imageCheck.maxHeight) {
            this.imageError = true;

            if (this.imageSize > this.imageCheck.maxSize) {
              this.imageCheck.message = 'VALIDATION_MSG.MAX_FILE_SIZE';
              this.imageCheck.messageMax = this.imageCheck.maxSize;
            } else if (image.width > this.imageCheck.maxWidth) {
              this.imageCheck.message = 'VALIDATION_MSG.MAX_FILE_WIDTH';
              this.imageCheck.messageMax = this.imageCheck.maxWidth;
            } else {
              this.imageCheck.message = 'VALIDATION_MSG.MAX_FILE_HEIGHT';
              this.imageCheck.messageMax = this.imageCheck.maxHeight;
            }
            this.removeUploadedFile();
            setTimeout(() => {
              this.imageError = false;
            }, this.fadeTimeout);
          } else {
            this.imageBase64 = e.target.result;
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.imageName = null;
    }
  }

  removeUploadedFile() {
    this.fileInput.nativeElement.value = "";
    this.fileAttr = null;
    this.showImage = false;
    this.newsForm.patchValue({
      pathImage: ""
    });
  }

  changeImage(event) {
    const setLocalImage = (localImage: string) => {
      this.singleNews.pathImage = localImage;
    };
    const file = event.target.files[0];

    const readFile = new FileReader();
    readFile.onload = function (eventFileReader) {
      // console.log(eventFileReader.target.result);
      setLocalImage(eventFileReader.target['result'].toString());
    };
    readFile.readAsDataURL(file);
  }

  loadResource = (element) => {
    return new Promise((resolve, rej) => {
      if (element.pathImage) {
        this._fileService.getResourceUri(element.pathImage).subscribe(
          (r) => {
            this.fileAttr = element.pathImage.split('/')[3];
            element.pathImage = "data:image/" + r.contentType + ";base64," + r.file;
            this.localImage = element.pathImage;
            this.showImage = true;
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
