import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-choose-lang',
  templateUrl: './choose-lang.component.html',
  styleUrls: ['./choose-lang.component.css']
})
export class ChooseLangComponent implements OnInit, OnDestroy {
  supportedLanguages: string[];
  currentLang = '';

  private langChange$: Subscription;

  constructor(private translateSrv: TranslateService) {
    this.supportedLanguages = this.translateSrv.getLangs();
    this.currentLang = this.translateSrv.currentLang;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.langChange$.unsubscribe();
  }

  selectLanguage(langEvent: any): void {
    const lang: string = langEvent.toString();
    if (this.supportedLanguages.indexOf(lang) >= 0) {
      //this.currentLang = lang;
      this.translateSrv.use(lang);
    }


  }


}
