import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NewsRoutingModule} from './news-routing.module';
import {NewsHomeComponent} from './news-home/news-home.component';
import {NewsManageComponent} from './news-manage/news-manage.component';
import {TranslateModule} from '@ngx-translate/core';
import {WrapperMaterialModule} from 'src/app/modules/material-module';
import {NewsCreateEditComponent} from './news-create-edit/news-create-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PartsModule} from 'src/app/modules/parts-module';
import {NewsDetailComponent} from './news-detail/news-detail.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {NewsListComponent} from './news-list/news-list.component';
import {DirectivesModule} from "../../modules/directives-module";
import {PipesModule} from "../../modules/pipes-module";
import {SwiperModule} from 'swiper/angular';


@NgModule({
  declarations: [
    NewsHomeComponent,
    NewsManageComponent,
    NewsCreateEditComponent,
    NewsDetailComponent,
    NewsListComponent
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
    TranslateModule,
    WrapperMaterialModule,
    ReactiveFormsModule,
    PartsModule,
    CarouselModule,
    IvyCarouselModule,
    DirectivesModule,
    FormsModule,
    PipesModule,
    SwiperModule,
    PipesModule
  ],
  exports: [
    NewsHomeComponent,
    NewsManageComponent
  ]
})
export class NewsModule {
}
