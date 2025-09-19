import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  constructor(private translate: TranslateService) {
  }

  /**
   * The APP_INITIALIZER injection token is a way for you to take part in the
   * Angular app initialization process to do your own work
   * this method is used how hook
   * @return {Promise<any>} promise object
   */
  load(): Promise<any> {
    const languages = ['en', 'it'];
    this.translate.addLangs(languages);
    this.translate.setDefaultLang('it');

    // TODO UNCOMMENT this line when multilanguage will be added in this application
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(new RegExp(languages.join("|"))) ? browserLang : 'en');

    return new Promise((resolve) => {
      console.log(`AppInitializer:: load`);
      resolve("");
    });
  }
}
