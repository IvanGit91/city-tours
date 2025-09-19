import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpErrorHandler, MessageService} from './shared';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppInitializerService} from './shared/services/app-initializer.service';
import {WrapperMaterialModule} from "./modules/material-module";
import {DirectivesModule} from "./modules/directives-module";
import {PartsModule} from "./modules/parts-module";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material/snack-bar";
import {JwtInterceptor} from "./_interceptors/jwt-interceptor.service";
import {ErrorInterceptor} from "./_interceptors/error-interceptor.service";
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faBook, faCocktail, faGlobe, faTimes, faTshirt} from "@fortawesome/free-solid-svg-icons";
import {faApple} from "@fortawesome/free-brands-svg-icons";
import {NewsModule} from './pages/news/news.module';
import {UserModule} from './pages/user/user.module';
import {ModalComponent} from './parts/delete-dialog/delete-dialog';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import {CarouselModule} from 'ngx-owl-carousel-o';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {UserIdleModule} from "angular-user-idle";
import {DistrictModule} from "./pages/district-home/district.module";
import {PoiModule} from "./pages/poi-home/poi.module";
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {HomeModule} from "./pages/home/home.module";
import {ResetPswModule} from './pages/reset-psw/reset-psw.module';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {MatPasswordStrengthModule} from '@angular-material-extensions/password-strength';
import {ProfileModule} from './pages/profile/profile.module';
import {OverlayComponent} from './parts/overlay/overlay.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {NgMatSearchBarModule} from 'ng-mat-search-bar';
import {PipesModule} from "./modules/pipes-module";
import {ProjectComponent} from './pages/project/project.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {SearchComponent} from './pages/search/search.component';
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule
} from "@angular-material-components/color-picker";
import {DeployComponent} from './pages/deploy/deploy.component';
import {NavTemplateComponent} from "./shared/templates/NavTemplateComponent";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {DistPaginatorIntl} from "./shared/util/DistPaginatorIntl";
import {LanguageInterceptor} from "./_interceptors/language-interceptor.service";


export const createTranslateLoader = (http: HttpClient) => {
  /* for development
  return new TranslateHttpLoader(
      http,
      '/start-angular/SB-Admin-BS4-Angular-6/master/dist/assets/i18n/',
      '.json'
  ); */
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

export function init_app(appLoadService: AppInitializerService) {
  return () => appLoadService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotFoundComponent,
    ModalComponent,
    OverlayComponent,
    ProjectComponent,
    SearchComponent,
    DeployComponent,
    NavTemplateComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    WrapperMaterialModule,
    DirectivesModule,
    PartsModule,
    FontAwesomeModule,
    NewsModule,
    UserModule,
    CarouselModule,
    ReactiveFormsModule,
    IvyCarouselModule,
    //UserIdleModule.forRoot({idle: 5, timeout: 5, ping: 120})
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120}),
    DistrictModule,
    PoiModule,
    MatSelectModule,
    MatAutocompleteModule,
    HomeModule,
    ResetPswModule,
    MatPasswordStrengthModule,
    ProfileModule,
    OverlayModule,
    NgMatSearchBarModule,
    PipesModule,
    FlexLayoutModule,
    FormsModule,
    NgxMatColorPickerModule
  ],
  providers: [CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true},
    {provide: APP_INITIALIZER, useFactory: init_app, deps: [AppInitializerService], multi: true},
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'}
    },
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'it_IT'},
    {provide: MatPaginatorIntl, useClass: DistPaginatorIntl},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    HttpErrorHandler,
    MessageService
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor(library: FaIconLibrary) {

    // Add an icon to the library for convenient access in other components
    library.addIcons(faBook, faApple, faTshirt, faCocktail, faGlobe, faTimes);
  }
}

