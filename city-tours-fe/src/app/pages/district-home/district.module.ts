import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {WrapperMaterialModule} from "../../modules/material-module";
import {RouterModule} from "@angular/router";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {DistrictHomeComponent} from "./district-home.component";
import {DirectivesModule} from "../../modules/directives-module";
import {PartsModule} from "../../modules/parts-module";
import {DistrictOpComponent} from "./district-op/district-op.component";
import {PipesModule} from "../../modules/pipes-module";
import {DistrictDetailComponent} from "./district-detail/district-detail.component";
import {NgxMatColorPickerModule} from "@angular-material-components/color-picker";


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
    PipesModule,
    NgxMatColorPickerModule
  ],
  declarations: [
    DistrictHomeComponent,
    DistrictOpComponent,
    DistrictDetailComponent
  ],
  exports: [
    DistrictHomeComponent,
    DistrictOpComponent,
    DistrictDetailComponent
  ]
})
export class DistrictModule {
}
