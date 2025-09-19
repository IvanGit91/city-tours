import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {WrapperMaterialModule} from './material-module';
import {TitleComponent} from "../shared/directives/title/title.component";
import {Title2Component} from "../shared/directives/title2/title2.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {DistHrefComponent} from "../shared/directives/dist-href/dist-href.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    LazyLoadImageModule,
    NgbAlertModule,
    WrapperMaterialModule,
    FontAwesomeModule,
  ],
  exports: [
    TitleComponent,
    Title2Component,
    DistHrefComponent
  ],
  declarations: [
    TitleComponent,
    Title2Component,
    DistHrefComponent
  ]
})
export class DirectivesModule {
}
