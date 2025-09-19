import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AppErrorStateMatcher} from "../../../shared/util/ErrorMatcher";
import * as Constant from '../../../shared/util/constant';
import {IMAGE_MAX_HEIGHT, IMAGE_MAX_SIZE_KB, IMAGE_MAX_WIDTH, WEB_SITE_REGEX} from '../../../shared/util/constant';
import * as L from 'leaflet';
import 'src/assets/libs/Leaflet.Editable';
import {animate, style, transition, trigger} from "@angular/animations";
import {PoiService} from "../../../shared/services/model/poi.service";
import {DistrictService} from "../../../shared/services/model/district.service";
import {District} from "../../../model/District";
import {Subject} from "rxjs";
import {Geo} from "../../../model/geo/Geo";
import {DistEnumData} from "../../../model/common/DistEnumData";
import {EnumService} from "../../../shared/services/model/enum.service";
import {DistTel} from "../../../model/common/DistTel";
import {DistUtils} from "../../../shared/util/DistUtils";
import {DistFile} from "../../../model/common/DistFile";
import {ImageCheck} from "../../../dto/ImageCheck";

declare const window: any;

@Component({
  selector: 'app-poi-op',
  templateUrl: './poi-op.component.html',
  styleUrls: ['./poi-op.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('500ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class PoiOpComponent extends L.Control implements OnInit, OnDestroy, AfterViewInit {
  matcher = new AppErrorStateMatcher();
  elemId: number;
  isEdit = false;
  geoError: boolean = false;
  districts = new Subject<District[]>();
  districtPoly: L.MultiPolygon[] = [];
  districtGeoJsons = [];
  mapPoi: L.Marker;
  poiType = new Subject<DistEnumData[]>();
  // IMAGES
  @ViewChild('imageInput') imageInput: ElementRef;
  imageName = null;
  imageBase64: any = null;
  imageSize: number;
  imageError: boolean = false;
  imageCheck: ImageCheck = new ImageCheck(IMAGE_MAX_SIZE_KB, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT);
  poi = this.fb.group({
    id: ([null]),
    denomination: (['', [Validators.required]]),
    description: (['',]),
    descriptionEng: (['',]),
    phone: (new DistTel('', '', '')),
    address: (['',]),
    webSite: (['', Validators.pattern(WEB_SITE_REGEX)]),
    time: (['',]),
    email: (['', Validators.email]),
    type: (['', [Validators.required]]),
    district: ([null, [Validators.required]]),
    geo: (['',]),
    imagePath: ([null,]),
    image: ([null,])
  });
  private map;
  private popup = L.popup();
  private fadeTimeout: number = 5000;
  private geo: Geo = new Geo();

  constructor(private _service: PoiService,
              private _d_service: DistrictService,
              private _enum_service: EnumService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
    super();
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: 'assets/img/leaflet/marker-icon.png',
      shadowUrl: 'assets/img/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 36]
    });
  }

  get utils() {
    return DistUtils;
  }

  get poiForm() {
    return this.poi.controls as any;
  }

  ngOnInit(): void {
    this.elemId = Number.parseInt(this.route.snapshot.paramMap.get(Constant.ID_NAME), 10);
    if (this.elemId === Constant.OP_ADD) {
    } else {
      this.isEdit = true;
      this._service.getById(this.elemId).subscribe(p => {
        if (p.imagePath !== null) {
          this.imageName = this.utils.nameFromPath(p.imagePath);
          this.imageBase64 = this.utils.file.toBase64Image(p.image);
        }
        p.image = null;
        this.poi.patchValue(p);
        this.geo.id = this.poi.get('geo').value.id;
        this.insertMarkerMap();
        this.selectDistrict(this.poi.get('district').value, {isUserInput: true, deletePoi: false});
      });
    }
    this._enum_service.poiType().subscribe(p => this.poiType.next(p.data));
    this._d_service.getAll().subscribe((d) => this.districts.next(d));
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map.off();
    this.map.remove();
  }

  isMarkerInsidePolygon(marker, multiPoly: L.MultiPolygon[]) {
    let inside = false;
    for (let k = 0; k < multiPoly.length; k++) {
      let polyPoints = multiPoly[k];

      // lat and lng inverted because of geojson
      const x = marker.getLatLng().lat, y = marker.getLatLng().lng;

      for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        const xi = polyPoints[i][1], yi = polyPoints[i][0];
        const xj = polyPoints[j][1], yj = polyPoints[j][0];

        const intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect && !inside) {
          inside = !inside;
          break;
        }
      }
      //console.log("INSIDE: ", inside);

      if (inside)
        break;
    }
    return inside;
  };

  isMarkerInsidePolygonOld(marker, poly) {
    const polyPoints = poly.getLatLngs()[0];
    const x = marker.getLatLng().lat, y = marker.getLatLng().lng;

    let inside = false;
    for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
      const xi = polyPoints[i].lat, yi = polyPoints[i].lng;
      const xj = polyPoints[j].lat, yj = polyPoints[j].lng;

      const intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  retrieveMarkersOld() {
    let marker;
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        // if (layer !== undefined && layer.getLatLngs() !== undefined) {
        marker = layer.getLatLng();
        if (marker !== undefined) {
          // this.geo = layer.toGeoJSON();
          this.geo.properties.showOnMap = true;
          this.geo.geometry.type = 'Point';
          // this.geo.geometry.coordinates = '';
          this.geo.geometry.coordinates = '[[[[' + marker.lat + ',' + marker.lng + ']]]]';
          this.poi.get('geo').patchValue(this.geo);
        }
      }
    });
  }

  retrieveMarkers() {
    if (this.mapPoi !== undefined) {
      const marker = this.mapPoi.getLatLng();
      if (marker !== undefined) {
        // this.geo = layer.toGeoJSON();
        this.geo.properties.showOnMap = true;
        this.geo.geometry.type = 'Point';
        // this.geo.geometry.coordinates = '';
        this.geo.geometry.coordinates = '[[[[' + marker.lat + ',' + marker.lng + ']]]]';
        this.poi.get('geo').patchValue(this.geo);
      }
    }
  }

  compareFunction(o1: any, o2: any) {
    return o1 !== null && o2 !== null && o1 !== "" && o2 !== "" && o1 === o2;
  }

  selectDistrict(d: District, event: any) {
    if (event.isUserInput) {
      if (this.districtGeoJsons !== undefined) {
        this.districtGeoJsons.forEach(dis => this.map.removeLayer(dis));
        this.districtGeoJsons = [];
      }
      if (event.deletePoi === undefined && this.mapPoi !== undefined) {
        this.map.removeLayer(this.mapPoi);
        this.mapPoi = undefined;
      }
      this.insertDistrictsMap(d);
    }
  }

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.imageError = false;
      const file = imgFile.target.files[0];
      this.imageName = file.name;
      this.imageSize = file.size / 1024; // In KB
      this.poi.patchValue({
        image: file
      });
      // Reset if duplicate image uploaded again
      this.imageInput.nativeElement.value = "";

      // HTML5 FileReader API
      let reader = new FileReader();
      let image = new Image();
      reader.onload = (e: any) => {
        image.src = e.target.result;
        image.onload = rs => {
          if (this.imageSize > this.imageCheck.maxSize || image.width > this.imageCheck.maxWidth || image.height > this.imageCheck.maxHeight) {
            if (this.imageSize > this.imageCheck.maxSize) {
              this.imageCheck.message = 'VALIDATION_MSG.MAX_FILE_SIZE';
              this.imageCheck.messageMax = this.imageCheck.maxSize;
            } else if (image.width > this.imageCheck.maxWidth) {
              this.imageCheck.message = 'VALIDATION_MSG.MAX_FILE_WIDTH';
              this.imageCheck.messageMax = this.imageCheck.maxWidth;
            } else {
              this.imageCheck.message = 'VALIDATION_MSG.MAX_FILE_HEIGHT';
              this.imageCheck.messageMax = this.imageCheck.maxHeight;
            }
            this.removeUploadedFile();
            this.imageError = true;
            setTimeout(() => {
              this.imageError = false;
            }, this.fadeTimeout);
          } else {
            this.imageBase64 = e.target.result;
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.imageName = null;
    }
  }

  removeUploadedFile() {
    this.imageInput.nativeElement.value = "";
    this.imageBase64 = null;
    this.imageName = null;
    this.poi.patchValue({
      imagePath: null,
      image: null
    });
  }

  onSubmit() {
    if (this.mapPoi !== undefined) {
      this.retrieveMarkers();
      this.poi.get('district').value.geos.forEach(geo => {
        geo.geometry.coordinates = '';
      });
      const image: DistFile = new DistFile(this.poi.value.image);
      this.poi.value.image = null;
      if (!this.isEdit) {
        this._service.save(this.poi.value).subscribe(d => {
            this.saveImage(d, image);
          },
          () => console.log('Error adding'));
      } else {
        this._service.update(this.poi.value).subscribe(d => {
            this.saveImage(d, image);
          },
          () => console.log('Error updating'));
      }
    } else {
      this.geoError = true;
      setTimeout(() => {
        this.geoError = false;
      }, this.fadeTimeout);
    }
  }

  saveImage(d, image) {
    if (image.file !== null) {
      this._service.upload(d.id, image.file).subscribe(d => {
        this.router.navigate(['/poi-home'], {state: {msg: ['MODELS.POI', 'OPERATIONS.SAVED']}});
      }, e => console.log(e));
    } else {
      this.router.navigate(['/poi-home'], {state: {msg: ['MODELS.POI', 'OPERATIONS.SAVED']}});
    }
  }

  private initMap(): void {
    // Map creation
    this.map = L.map('map-poi', {
      center: [40.860672, 14.268092],
      zoom: 13,
      editable: true,
      scrollWheelZoom: true
    });

    // Openstreetmap association
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    // Creation leaflet check controls, left bar
    const editControl = L.Control.extend({
      options: {
        position: 'topleft',
        callback: null,
        kind: '',
        html: ''
      },

      onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
          link = L.DomUtil.create('a', '', container) as HTMLAnchorElement;
        link.href = '#';
        link.title = 'Create a new ' + this.options.kind;
        link.innerHTML = this.options.html;
        L.DomEvent.on(link, 'click', L.DomEvent.stop)
          .on(link, 'click', function () {
            window.LAYER = this.options.callback.call(map.editTools);
          }, this);

        return container;
      }
    });

    // Creation tool marker generation
    const markerControl = editControl.extend({
      options: {
        position: 'topleft',
        callback: this.map.editTools.startMarker,
        kind: 'marker',
        html: '🖈'
      }
    });
    this.map.addControl(new markerControl());


    // At the press of CTRL + right mouse button it is possible to delete an editable polygon
    const deleteShape = (e) => {
      if (e.originalEvent.ctrlKey && e.target.editor.enabled()) {
        this.map.removeLayer(e.target);
        this.mapPoi = undefined;
      }
    };
    this.map.on('layeradd', function (e) {
      if (e.layer instanceof L.Marker) {
        e.layer.on('click', L.DomEvent.stop).on('click', deleteShape, e.layer);
      }
    });

    this.map.on('editable:drawing:move', (e) => {
      if (this.districtPoly !== undefined) {
        const inside = this.isMarkerInsidePolygon(e.layer, this.districtPoly);
        if (!inside) {
          e.layer.setLatLng(e.oldLatLng);
        }
      }
    });

    this.map.on('editable:drawing:commit', (e) => {
      if (this.districtPoly === undefined) {
        e.layer.remove();
      } else {
        const inside = this.isMarkerInsidePolygon(e.layer, this.districtPoly);
        if (!inside) {
          e.layer.remove();
        } else {
          this.mapPoi = e.layer;
        }
      }
    });

  }

  private insertMarkerMap(): void {
    // When pressing CTRL + right mouse button, it is possible to delete an editable polygon
    const deleteShape = function (e) {
      if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) {
        this.editor.deleteShapeAt(e.latlng);
      }
    };
    const coords = this.poi.get('geo').value.geometry.coordinates;
    this.mapPoi = L.marker(coords[0][0][0]).addTo(this.map);
    this.mapPoi.enableEdit();
    this.mapPoi.on('click', L.DomEvent.stop).on('click', deleteShape);
    this.map.flyTo(new L.LatLng(coords[0][0][0][0], coords[0][0][0][1]), 12);
  }

  private insertDistrictsMap(d: District): void {
    let centerCoords: any = null;
    d.geos.forEach(geo => {
      const multiPolygon = [{
        'type': 'Feature',
        'properties': {
          'cityId': geo.properties.cityId,
          'showOnMap': geo.properties.showOnMap,
          'additionalPopupContent': geo.properties.additionalPopupContent
        },
        'geometry': {
          'type': geo.geometry.type,
          'coordinates': geo.geometry.coordinates
        }
      }] as any;

      geo.geometry.coordinates.forEach(multi => {
        multi.forEach(poly => {
          this.districtPoly.push(poly);
        });
      });

      const districtGeoJson = L.geoJSON(multiPolygon, {
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.additionalPopupContent) {
            layer.bindPopup(feature.properties.additionalPopupContent);
          }
        },
        filter: (feature, layer) => {
          return feature.properties.showOnMap;
        }
      }).addTo(this.map);
      districtGeoJson.addTo(this.map);
      this.districtGeoJsons.push(districtGeoJson);

      if (centerCoords === null) {
        centerCoords = geo.geometry.coordinates[0][0][0];
      }
    });
    if (centerCoords !== null) {
      this.map.flyTo(new L.LatLng(centerCoords[1], centerCoords[0]), 10);
    }
  }

  private insertDistrictsMapNoGeo(d: District): void {
    d.geos.forEach(geo => {
      geo.geometry.coordinates.forEach(multi => {
        L.polygon(multi).addTo(this.map);

        multi.forEach(poly => {
          this.districtPoly.push(poly);

        });

      });
    });
  }
}
