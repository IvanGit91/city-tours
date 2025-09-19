import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {DistUtils} from "../../../shared/util/DistUtils";
import {Location} from "@angular/common";
import 'leaflet.markercluster';
import {DistrictService} from "../../../shared/services/model/district.service";
import {PoiService} from "../../../shared/services/model/poi.service";
import {District} from "../../../model/District";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Poi} from "../../../model/poi/Poi";
import {MatPaginator} from "@angular/material/paginator";
import {animate, style, transition, trigger} from "@angular/animations";
import {ActivatedRoute, Router} from "@angular/router";
import {EnumService} from "../../../shared/services/model/enum.service";
import {DistEnumData} from "../../../model/common/DistEnumData";
import {DEF_COLOR} from "../../../shared/util/constant";
import {PoiTypeEnum} from "../../../enum/PoiTypeEnum";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({opacity: 0}),
        animate('800ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('600ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class HomeDetailComponent extends L.Control implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  distId: number = -1;
  district = new Subject<District>();
  pois = new BehaviorSubject<Poi[]>(null);
  allPois = new BehaviorSubject<Poi[]>(null);
  poiType = new Observable<DistEnumData[]>();
  paginating: boolean = false;
  pageSize = 6;
  currentPage = 0;
  totalSize = 0;
  selectedMarkerData: any;
  currentLang: string;
  goTo: string;
  detail: string;
  lastMarker: any = null;
  private map;
  private geoJsonLayer;
  private defMarker = L.icon({
    iconUrl: 'assets/img/leaflet/marker-icon.png',
    shadowUrl: 'assets/img/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 36],
    popupAnchor: [1, -20]
  });

  private greenMarker = L.icon({
    iconUrl: 'assets/img/leaflet/marker-icon-green.png',
    shadowUrl: 'assets/img/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 36],
    popupAnchor: [1, -20]
  });

  private yellowMarker = L.icon({
    iconUrl: 'assets/img/leaflet/marker-icon-yellow.png',
    shadowUrl: 'assets/img/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 36],
    popupAnchor: [1, -20]
  });

  constructor(private location: Location,
              private _dist_service: DistrictService,
              private _poi_service: PoiService,
              private _enum_service: EnumService,
              private ref: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              private translateSrv: TranslateService) {
    super();
    L.Marker.prototype.options.icon = this.defMarker;
    this.currentLang = this.translateSrv.currentLang;
  }

  get utils() {
    return DistUtils;
  }

  get poyTypeEnum() {
    return PoiTypeEnum;
  }

  ngOnInit(): void {
    const tr$ = this.translateSrv.getTranslation(this.translateSrv.currentLang).subscribe((t) => {
      this.goTo = t.LABELS.GO_TO;
      this.detail = t.LABELS.DETAIL;
      this.initMap();
      this.distId = Number.parseInt(this.route.snapshot.paramMap.get('id'));
      this.poiType = this._enum_service.poiTypes;
      this._dist_service.getById(this.distId).subscribe(d => {
        this.district.next(d);
        this.insertPolygonMap(d);
        this.handlePage({pageIndex: this.currentPage, pageSize: this.pageSize});
      });
    }, () => {
    }, () => {
      tr$.unsubscribe();
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.map.off();
    this.map.remove();
  }

  handlePage(e: any) {
    this.paginating = false;
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this._poi_service.getAllByDistrictPage(this.distId, this.currentPage, this.pageSize).subscribe((p) => {
      this.ref.detectChanges();
      this.paginating = true;
      this.ref.detectChanges();
      this.pois.next(p.content);
      this.totalSize = p.totalElements;
    });

    // Light version: less information is loaded, including images
    this._poi_service.getAllLightByDistrict(this.distId).subscribe((p) => {
      this.allPois.next(p);
      this.insertPoisMap(p);
    });

  }

  navigate(poiId: number) {
    this.router.navigate(['/poi-detail/' + poiId]);
  }

  clearMap() {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.MarkerCluster || layer instanceof L.MarkerClusterGroup) {
        this.map.removeLayer(layer);
      }
    });
  }

  @HostListener('document:mousemove', ['$event'])
  mousemove(event) {
    if (this.lastMarker !== null && event.path !== undefined) {
      const match = event.path.filter(p => p.classList !== undefined).some(p => p.classList.contains("leaflet-marker-icon") || p.classList.contains("leaflet-popup-content-wrapper"));
      if (!match) {
        this.lastMarker.closePopup();
        this.lastMarker = null;
      }
    }
  }

  // To make the click on the popup work
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.classList.contains("leaf-button")) {
      let data = this.selectedMarkerData;
      delete data.icon;

      if (this.selectedMarkerData.light) {
        this._poi_service.getById(this.selectedMarkerData.poiId).subscribe(poi => {
          data = this.generateData(poi);
          DistUtils.openPoiDialog(data);
        })
      } else {
        DistUtils.openPoiDialog(data);
      }
    }
  }

  generateData(p: Poi) {
    let icon;
    if (p.type === PoiTypeEnum.Storico) {
      icon = this.greenMarker;
    } else if (p.type === PoiTypeEnum.Culturale) {
      icon = this.yellowMarker;
    }
    // TODO - to update with the new poi types
    return {
      icon: icon,
      poiId: p.id,
      denomination: p.denomination,
      description: this.currentLang === 'it' ? p.description : p.descriptionEng,
      address: p.address,
      webSite: p.webSite,
      phone: p.phone,
      email: p.email,
      time: p.time,
      type: p.type,
      logo: p.image !== null ? DistUtils.file.toBase64Image(p.image) : null,
      light: p.light
    }
  }

  iconForPoiType(type: string) {
    let typeClass = 'icon_set_1_icon-42';
    // TODO - to add with the new poi types
    if (type !== null) {
      switch (type) {
        case PoiTypeEnum.Storico:
          typeClass = 'icon_set_1_icon-44';
          break;
        case PoiTypeEnum.Culturale:
          typeClass = 'icon_set_1_icon-43';
          break;
        default:
          typeClass = 'icon_set_1_icon-44';
          break;
      }
    }
    return typeClass;
  }

  openDialogFromPoiElement(p: Poi) {
    DistUtils.openPoiDialog(this.generateData(p));
  }

  markersFilter(type) {
    this.clearMap();
    // Filter POIs
    const filteredPois = type !== null ? this.allPois.getValue().filter((p) => p.type === type) : this.allPois.getValue();
    this.insertPoisMap(filteredPois);
  }

  centerOnMap(p: Poi) {
    const coords = p.geo.geometry.coordinates;
    this.map.flyTo(new L.LatLng(coords[0][0][0][0], coords[0][0][0][1]), 12); // Sposta la mappa
  }

  private initMap(): void {
    // Map creation
    this.map = L.map('map-detail', {
      center: [40.860672, 14.268092],
      zoom: 13,
      maxZoom: 30
    });

    // Map association of openstreetmap
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }

  private insertPolygonMap(d: District): void {
    let centerCoords: any = null;
    d.geos.forEach(geo => {
      const multiPolygon = [{
        'type': 'Feature',
        'properties': {
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
            layer.bindPopup(feature.properties.additionalPopupContent);
          }
        },
        filter: (feature, layer) => {
          return feature.properties.showOnMap;
        }
      } as any).addTo(this.map);

      if (centerCoords === null) {
        centerCoords = geo.geometry.coordinates[0][0][0];
      }
    });
    if (centerCoords !== null) {
      this.map.flyTo(new L.LatLng(centerCoords[1], centerCoords[0]), 10); // Move the map
    }
  }

  private insertPolygonMapNoGeo(d: District): void {
    const coords = d.geos[0].geometry.coordinates;  //UPDATE
    L.polygon(coords).addTo(this.map);
  }

  private insertPoisMap(po: Poi[]): void {
    this.createCluster(po);
  }

  private createCluster(elems: Poi[]) {
    let markers = L.markerClusterGroup();
    elems.forEach((e) => {
      const popup = '<div><b>' + e.denomination + '</b></div>' +
        '<div class="d-flex align-items-center"><span>' + this.goTo + '</span><button type="button" mat-button class="leaf-button">' + this.detail + '</button></div>';
      let marker = this.createMarker(e, popup);
      markers.addLayer(marker);

      marker.on({
        click: (marker) => {
          this.selectedMarkerData = marker.target.options;
        },
        mouseover: (marker) => {
          this.selectedMarkerData = marker.target.options;
          this.lastMarker = marker.target;
          marker.target.openPopup();
        },
      });

    });
    markers.addTo(this.map);
  }

  private createMarker(p: Poi, popup: string) {
    const coordinates = p.geo.geometry.coordinates[0][0][0];
    const options = this.generateData(p);
    return L.marker([coordinates[0], coordinates[1]], options).bindPopup(popup);
  }

  // OLD: with the geojson
  private insertGeoPoisMap(po: Poi[]): void {
    let markers = L.markerClusterGroup();
    let features = [];
    po.forEach((p) => {
      features.push({
        "type": "Point",
        "id": p.id,
        "properties": {
          "showOnMap": p.geo.properties.showOnMap
        },
        "geometry": {"type": p.geo.geometry.type, "coordinates": p.geo.geometry.coordinates[0][0]}
      });
    });

    const geoJsonData = {
      "type": "FeatureCollection",
      "features": features
    };

    this.geoJsonLayer = L.geoJSON(geoJsonData, {
      style: (feature) => {
        switch (feature.properties.party) {
          case 'Republican':
            return {color: '#ff0000'};
          case 'Democrat':
            return {color: '#0000ff'};
        }
        return null;
      },
      onEachFeature: (feature, layer) => {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
          layer.bindPopup(feature.properties.popupContent);
        }
      },
      filter: (feature, layer) => {
        return feature.properties.showOnMap;
      },
      // Invert lat and lng because geojson takes them in the opposite order
      coordsToLatLng: function (coords) {
        return new L.LatLng(coords[0], coords[1], coords[2]);
      }
    });
    markers.addLayer(this.geoJsonLayer);
    this.map.addLayer(markers);
  }
}
