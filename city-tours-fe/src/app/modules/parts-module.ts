import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {NgbAlertModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WrapperMaterialModule} from './material-module';
import {FooterComponent} from "../parts/footer/footer.component";
import {MatNavigationComponent} from "../parts/mat-navigation/mat-navigation.component";
import {NgxUiLoaderConfig, NgxUiLoaderModule, NgxUiLoaderRouterModule, SPINNER} from "ngx-ui-loader";
import {ChooseLangComponent} from "../parts/choose-lang/choose-lang.component";
import {ImageComponent} from "../parts/image/image.component";
import {DistAccordionComponent} from "../parts/dist-accordion/dist-accordion.component";
import {DistButtonDialogComponent} from "../parts/dist-button-dialog/dist-button-dialog.component";
import {DistDialogComponent} from "../parts/dist-button-dialog/dist-dialog/dist-dialog.component";
import {ListComponent} from "../parts/choose-lang/list/list.component";
import {DistMessagesComponent} from "../parts/dist-messages/dist-messages.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LoginDialogComponent} from "../parts/login-dialog/login-dialog.component";
import {RichTextEditorComponent} from '../parts/rich-text-editor/rich-text-editor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {DistChooseDialogComponent} from "../parts/dist-choose-dialog/dist-choose-dialog.component";
import {DistTelInputComponent} from "../parts/dist-tel-input/dist-tel-input.component";
import {PoiDetailDialogComponent} from "../parts/poi-detail-dialog/poi-detail-dialog.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {DirectivesModule} from "./directives-module";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsType: SPINNER.rectangleBounce,
  overlayColor: '#fff',
  fgsColor: '#555',
  pbColor: '#555',
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule,
    TranslateModule,
    LazyLoadImageModule,
    NgbAlertModule,
    WrapperMaterialModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    CKEditorModule,
    FlexLayoutModule,
    DirectivesModule
  ],
  exports: [
    MatNavigationComponent,
    FooterComponent,
    ChooseLangComponent,
    ListComponent,
    ImageComponent,
    DistAccordionComponent,
    DistButtonDialogComponent,
    DistDialogComponent,
    DistMessagesComponent,
    LoginDialogComponent,
    ReactiveFormsModule,
    RichTextEditorComponent,
    DistChooseDialogComponent,
    DistTelInputComponent,
    PoiDetailDialogComponent
  ],
  declarations: [
    MatNavigationComponent,
    FooterComponent,
    ChooseLangComponent,
    ListComponent,
    ImageComponent,
    DistAccordionComponent,
    DistButtonDialogComponent,
    DistDialogComponent,
    DistMessagesComponent,
    LoginDialogComponent,
    RichTextEditorComponent,
    DistChooseDialogComponent,
    DistTelInputComponent,
    PoiDetailDialogComponent
  ]
})
export class PartsModule {
}
