import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {WrapperMaterialModule} from "../../modules/material-module";
import {RouterModule} from "@angular/router";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {DirectivesModule} from "../../modules/directives-module";
import {PoiHomeComponent} from "./poi-home.component";
import {PoiOpComponent} from "./poi-op/poi-op.component";
import {PoiDetailComponent} from './poi-detail/poi-detail.component';
import {PartsModule} from "../../modules/parts-module";
import {PipesModule} from "../../modules/pipes-module";


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
    ReactiveFormsModule,
    DirectivesModule,
    PartsModule,
    PipesModule
  ],
  declarations: [
    PoiHomeComponent,
    PoiOpComponent,
    PoiDetailComponent
  ],
  exports: [
    PoiHomeComponent,
    PoiOpComponent,
    PoiDetailComponent
  ]
})
export class PoiModule {
}
