import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {DistUtils} from "../../../shared/util/DistUtils";
import {Location} from "@angular/common";
import 'leaflet.markercluster';
import {DistrictService} from "../../../shared/services/model/district.service";
import {District} from "../../../model/District";
import {Subject} from "rxjs";
import {DEF_COLOR} from "../../../shared/util/constant";
import {SwiperComponent} from "swiper/types/shared";
import SwiperCore, {
  A11y,
  Autoplay,
  Controller,
  Navigation,
  Pagination,
  Scrollbar,
  Thumbs,
  Virtual,
  Zoom
} from "swiper/core";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends L.Control implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("swiperRef", {static: false}) swiperRef?: SwiperComponent; //SwiperComponent | ElementRef
  district = new Subject<District>();
  districts = new Subject<District[]>();
  selectedDistrictProp: any = null;
  goTo: string;
  detail: string;
  // SWIPER SLIDER
  navigation = true;
  autoplay = {
    delay: 1500,
    disableOnInteraction: false
  };
  pagination = false;
  breakpoints = {
    0: {slidesPerView: 1, spaceBetween: 20},
    768: {slidesPerView: 3, spaceBetween: 40},
    1024: {slidesPerView: 7, spaceBetween: 50}
  };
  private map;
  private carouselGoBack: number = 1500;
  private lastLayer: any = null;
  private defMarker = L.icon({
    iconUrl: 'assets/img/leaflet/marker-icon.png',
    shadowUrl: 'assets/img/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 36]
  });

  constructor(private location: Location,
              private _dist_service: DistrictService,
              private router: Router,
              private translateSrv: TranslateService) {
    super();
    L.Marker.prototype.options.icon = this.defMarker;
  }

  get utils() {
    return DistUtils;
  }

  ngOnInit(): void {
    const tr$ = this.translateSrv.getTranslation(this.translateSrv.currentLang).subscribe((t) => {
      this.goTo = t.LABELS.GO_TO;
      this.detail = t.LABELS.DETAIL;
      this.initMap();
    }, () => {
    }, () => {
      tr$.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    DistUtils.messageFromState(this.location.getState());
  }

  ngOnDestroy(): void {
    this.map.off();
    this.map.remove();
  }

  @HostListener('document:mousemove', ['$event'])
  mousemove(event) {
    if (this.lastLayer !== null && event.path !== undefined) {
      const match = event.path
        .filter(p => p.classList !== undefined)
        .some(p => p.classList.contains("leaflet-interactive") || p.classList.contains("leaflet-popup-content-wrapper"));
      if (!match) {
        this.lastLayer.closePopup();
        this.lastLayer = null;
      }
    }
  }

  // To make the click on the popup work
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.classList.contains("leaf-button")) {
      this.router.navigate(['/home-detail/' + this.selectedDistrictProp.districtId]);
    }
  }

  onSlideChange(swiper: any) {
    // To solve infinite loop bug
    if (swiper.isEnd) {
      setTimeout(() => {
        swiper.slideTo(0);
      }, this.carouselGoBack);
    }
  }

  private initMap(): void {
    // Map creation
    this.map = L.map('map-home', {
      center: [40.860672, 14.268092],
      zoom: 10,
      maxZoom: 30,
      scrollWheelZoom: false
    });

    // Map association of openstreetmap
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this._dist_service.getAllApproved().subscribe(p => {
      p.forEach((d) => this.insertDistrictsMap(d));
      this.districts.next(p);
    });
  }

  private insertDistrictsMap(d: District): void {
    d.geos.forEach(geo => {
      const multiPolygon = [{
        'type': 'Feature',
        'properties': {
          'districtId': d.id,
          'cityId': geo.properties.cityId,
          'showOnMap': geo.properties.showOnMap,
          'additionalPopupContent': geo.properties.additionalPopupContent,
          'color': geo.properties.color
        },
        'geometry': {
          'type': geo.geometry.type,
          'coordinates': geo.geometry.coordinates
        }
      }] as any;

      L.geoJSON(multiPolygon, {
        style: (feature) => {
          const color = feature.properties.color === undefined ? DEF_COLOR : feature.properties.color;
          return {color: color};
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.additionalPopupContent) {
            const popup = '<div><b>' + feature.properties.additionalPopupContent + '</b></div>' +
              '<div class="d-flex align-items-center"><span>' + this.goTo + '</span><button type="button" mat-button class="leaf-button">' + this.detail + '</button></div>';
            layer.bindPopup(popup);
          }

          layer.on({
            click: (layer) => {
              this.selectedDistrictProp = layer.target.feature.properties;
            },
            mouseover: (layer) => {
              this.selectedDistrictProp = layer.target.feature.properties;
              this.lastLayer = layer.target;
              layer.target.openPopup();
            },
            mouseout: (layer) => {
              // if (!layer.originalEvent.relatedTarget.classList.contains("leaflet-popup-content-wrapper")) {
              //   layer.target.closePopup();
              // }
            }
          });

        },
        filter: (feature, layer) => {
          return feature.properties.showOnMap;
        }
      } as any).addTo(this.map);
    });
  }

  // pagination = {
  //   clickable: true,
  //   renderBullet: function (index, className) {
  //     return '<span class="' + className + '">' + (index + 1) + "</span>";
  //   },
  // };

}
