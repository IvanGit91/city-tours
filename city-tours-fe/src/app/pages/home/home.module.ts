import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home/home.component';
import {NewsModule} from '../news/news.module';
import {HomeDetailComponent} from './home-detail/home-detail.component';
import {LazyLoadImageModule} from "ng-lazyload-image";
import {NgbAlertModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {DirectivesModule} from "../../modules/directives-module";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {WrapperMaterialModule} from "../../modules/material-module";
import {CarouselModule} from "ngx-owl-carousel-o";
import {IvyCarouselModule} from "angular-responsive-carousel";
import {SwiperModule} from "swiper/angular";


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    NewsModule,
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
    CarouselModule,
    NgbModule,
    IvyCarouselModule,
    SwiperModule
  ],
  declarations: [
    HomeComponent,
    HomeDetailComponent
  ],
  exports: [
    HomeComponent,
    HomeDetailComponent
  ]
})
export class HomeModule {
}
