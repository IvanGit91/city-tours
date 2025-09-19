import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResetPswComponent} from './reset-psw.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {WrapperMaterialModule} from 'src/app/modules/material-module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DirectivesModule} from 'src/app/modules/directives-module';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatPasswordStrengthModule} from '@angular-material-extensions/password-strength';

@NgModule({
  declarations: [
    ResetPswComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbAlertModule,
    DirectivesModule,
    TranslateModule,
    WrapperMaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatPasswordStrengthModule
  ],
  exports: [
    ResetPswComponent
  ]
})
export class ResetPswModule {
}
