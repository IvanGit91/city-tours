import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile/profile.component';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {WrapperMaterialModule} from 'src/app/modules/material-module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DirectivesModule} from 'src/app/modules/directives-module';
import {PartsModule} from 'src/app/modules/parts-module';
import {RedactorEditComponent} from './redactor-edit/redactor-edit.component';

@NgModule({
  declarations: [
    ProfileComponent,
    RedactorEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgbAlertModule,
    WrapperMaterialModule,
    FontAwesomeModule,
    DirectivesModule,
    PartsModule
  ]
})
export class ProfileModule {
}
