import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserOpComponent} from './user-op/user-op.component';
import {UserManageComponent} from './user-manage/user-manage.component';
import {TranslateModule} from '@ngx-translate/core';
import {WrapperMaterialModule} from 'src/app/modules/material-module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DirectivesModule} from 'src/app/modules/directives-module';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {PipesModule} from "../../modules/pipes-module";

@NgModule({
  declarations: [
    UserOpComponent,
    UserManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LazyLoadImageModule,
    NgbAlertModule,
    DirectivesModule,
    UserRoutingModule,
    TranslateModule,
    WrapperMaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    PipesModule
  ],
  exports: [
    UserManageComponent,
    UserOpComponent
  ]
})
export class UserModule {
}
